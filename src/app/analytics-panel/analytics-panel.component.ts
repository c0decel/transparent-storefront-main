import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { AuthService } from '../auth.service';

//Import models
import { Sale } from '../shared/models/sale.model';
import { Expense } from '../shared/models/expense.model';
import { User } from '../shared/models/user.model';
import { Product } from '../shared/models/product.model';
import { Supply } from '../shared/models/supply.model';
import { Tag } from '../shared/models/tag.model';

interface DataPoint {
  label: string;
  y: number;
  type: 'sale' | 'expense' | 'net-profit';
}

@Component({
  selector: 'app-analytics-panel',
  templateUrl: './analytics-panel.component.html',
  styleUrls: ['./analytics-panel.component.scss']
})
export class AnalyticsPanelComponent implements OnInit {
  user: User[]=[];
  products: Product[]=[];
  expenses: Expense[]=[];
  sales: Sale[]=[];
  supplies: Supply[]=[];
  tags: Tag[]=[];

  dataPoints: DataPoint[]=[];
  salesDataPoints: any[]=[];

  isJanitor: boolean = false;
  groupedExpenses: { [formattedExpense: string]: (Expense)[] } = {};
  groupedSales: { [formattedSale: string]: (Sale)[] } = {};

  chartOptions: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public utilsService: UtilsService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public fetchProductData: FetchProductDataService,
    public fetchApiData: FetchApiDataService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.getTags();
    this.getSupplies();
    this.getFinances();
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Get all products
   */
  getProducts(): void {
    this.fetchProductData.getAllProducts().subscribe(
    (products) => {
      this.products = products;
    }, 
    (error) => {
      console.error(`Error fetching products: ${error}`);
    });
  }

  /**
   * Get all tags
   */
  getTags(): void {
    this.fetchApiData.getAllTags().subscribe(
      (tags) => {
        this.tags = tags;
        console.log(this.tags[0])
      },
      (error) => {
        console.log(`Error fetching tags: ${error}`);
      }
    );
  }

  /**
   * Get all supplies
   */
  getSupplies(): void {
    this.fetchApiData.getAllSupplies().subscribe(
      (supplies) => {
        this.supplies = supplies;
      },
      (error) => {
        console.log(`Error fetching supplies: ${error}`);
      }
    );
  }

  /**
   * Get all sales and expense data
   */
  getFinances(): void {
    const allDataPoints: DataPoint[] = [];
    /**
     * Get all sales 
     */
    this.fetchApiData.getAllSales().subscribe(
      (sales: Sale[]) => {
        this.sales = sales;
        this.groupedSales = this.groupSalesByDate(sales);

        for (const formattedSale in this.groupedSales) {
          const salesForDate = this.groupedSales[formattedSale];
          const totalSalesForDate = salesForDate.reduce((total, sale) => total + sale.Amount, 0);
          allDataPoints.push({ label: formattedSale, y: totalSalesForDate, type: 'sale' });
        } 
      },
      (error) => {
        console.log(`Error fetching sales: ${error}`);
      }
    );

    /**
     * Get all expenses
     */
    this.fetchApiData.getAllExpenses().subscribe(
      (expenses: Expense[]) => {
        this.expenses = expenses;
        this.groupedExpenses = this.groupExpensesByDate(expenses);
        
        for (const formattedExpense in this.groupedExpenses) {
          const expensesForDate = this.groupedExpenses[formattedExpense];
          const totalExpensesForDate = expensesForDate.reduce((total, expense) => total + expense.Amount, 0);
          allDataPoints.push({ label: formattedExpense, y: totalExpensesForDate, type: 'expense' });
        }
        this.dataPoints = allDataPoints;
        console.log(this.dataPoints)
        this.populateChartOptions(this.dataPoints)
        },
        (error) => {
        console.log(`Error fetching expenses: ${error}`);
        }
      );
    }

  /**
   * Format sales and expense dates
   * @param dateString 
   * @returns formatted date
   */ 
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  }

  /**
   * Group sales by date
   * @param sales 
   * @returns sales grouped by date
   */
  groupSalesByDate(sales: Sale[]): { [formattedSale: string]: Sale[] } {
    const groupedSales: { [formattedSale: string]: Sale[] } = {};
  
    sales.forEach(sale => {
      const formattedSale = this.formatDate(sale.SaleDate);
      if (!groupedSales[formattedSale]) {
        groupedSales[formattedSale] = [];
      }
      groupedSales[formattedSale].push(sale);
      
    });

    return groupedSales;
  }

  /**
   * Group expenses by date
   * @param expenses 
   * @returns expenses grouped by date
   */
  groupExpensesByDate(expenses: Expense[]): { [formattedExpense: string]: Expense[] } {
    const groupedExpenses: { [formattedExpense: string]: Expense[] } = {};
  
    expenses.forEach(expense => {
      const formattedExpense = this.formatDate(expense.ExpenseDate);
      if (!groupedExpenses[formattedExpense]) {
        groupedExpenses[formattedExpense] = [];
      }
      groupedExpenses[formattedExpense].push(expense);
    });
    
    return groupedExpenses;
  }

  /**
   * Redirects to details of selected tag
   * @param _id ID of tag
   * @param Tag name of tag
   * @param Description description of tag
   */
  openTagDetails(_id: string, Tag: string, Description: string): void {
    console.log(_id)
    this.router.navigate(['/tag-details', _id], {
      state: {
        data: {
          _id: _id,
          Tag: Tag,
          Description: Description
        }
      }
    })
  }

  /**
   * Populate analytics chart
   * @param dataPoints sales and expense data
   */
  populateChartOptions(dataPoints: DataPoint[]): void {

    const groupedData: { [date: string]: { sales: number, expenses: number } } = {};
  
    dataPoints.forEach(data => {
      const date = data.label;
      const type = data.type;
      const amount = data.y;
  
      if (!groupedData[date]) {
        groupedData[date] = { sales: 0, expenses: 0 };
      }
  
      if (type === 'sale') {
        groupedData[date].sales += amount;
      } else if (type === 'expense') {
        groupedData[date].expenses += amount;
      }
    });

    let netProfit = 0;
  
    const chartDataPoints: DataPoint[] = [];
    for (const date in groupedData) {
      const totalSales = groupedData[date].sales;
      const totalExpenses = groupedData[date].expenses;
      netProfit = netProfit + (totalSales - totalExpenses);
  
      chartDataPoints.push(
        { label: date, y: totalSales, type: 'sale' },
        { label: date, y: totalExpenses, type: 'expense' },
        { label: date, y: netProfit, type: 'net-profit' }
      );
    }
  
    // Create chart options with all data points
    this.chartOptions = {
      title: {
        text: 'Sales, Expenses, and Net Profit by Date'
      },
      axisX: {
        title: 'Date'
      },
      axisY: {
        title: 'Amount'
      },
      toolTip: {
        shared: true
      },
      data: [
        {
          type: 'spline',
          name: 'Total Sales',
          showInLegend: true,
          dataPoints: chartDataPoints.filter(data => data.type === 'sale')
        },
        {
          type: 'spline',
          name: 'Total Expenses',
          showInLegend: true,
          dataPoints: chartDataPoints.filter(data => data.type === 'expense')
        },
        {
          type: 'spline',
          name: 'Net Profit',
          showInLegend: true,
          dataPoints: chartDataPoints.filter(data => data.type === 'net-profit')
        }
      ]
    };
  }

  goToAdminPanel(): void {
    this.utilsService.goToAdminPanel();
  }
}
