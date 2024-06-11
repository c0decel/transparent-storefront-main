import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { AuthService } from '../auth.service';
import { Sale } from '../models/sale.model';
import { Expense } from '../models/expense.model';

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
  user: any;
  products: any[] = [];
  isJanitor: boolean = false;
  sales: Sale[] = [];
  groupedExpenses: { [formattedExpense: string]: (Expense)[] } = {};
  groupedSales: { [formattedSale: string]: (Sale)[] } = {};
  salesDataPoints: any[]=[];
  dataPoints: DataPoint[]=[];
  expenses: Expense[] = [];
  supplies: any[]=[];
  tags: any[] = [];
  chartOptions: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public fetchProductData: FetchProductDataService,
    public fetchApiData: FetchApiDataService
  ) {}

  ngOnInit(): void {
    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.user = this.authService.getUser();

    this.fetchApiData.getAllTags().subscribe(tags => {
      this.tags = tags;
    });

    this.fetchApiData.getAllSupplies().subscribe(supplies => {
      this.supplies = supplies;
    });
    
    this.getFinances();
  }

  getFinances(): void {
    const allDataPoints: DataPoint[] = [];
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
      console.log('Error fetching sales:', error);
    });

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
      console.log('Error fetching expenses:', error);
    });

  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  }

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

  getProducts(): void {
    this.fetchProductData.getAllProducts().subscribe(
    (resp: any) => {
      this.products = resp;
    }, 
    (error) => {
      console.error('Error fetching products:', error);
    });
  }

  openTagDetails(_id: string, Tag: string, Description: string): void {
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

  isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  goToAdminPanel(): void {
    this.router.navigate(['admin-panel']);
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['store']);
  }

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
  
  
  
  
}
