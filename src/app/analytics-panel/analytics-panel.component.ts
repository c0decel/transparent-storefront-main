import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-analytics-panel',
  templateUrl: './analytics-panel.component.html',
  styleUrls: ['./analytics-panel.component.scss']
})
export class AnalyticsPanelComponent implements OnInit {
  user: any;
  products: any[] = [];
  isJanitor: boolean = false;
  expenses: any[] =[];
  sales: any[]=[];
  supplies: any[]=[];
  tags: any[] = [];
  chartOptions: any = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
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

    this.fetchApiData.getAllExpenses().subscribe(expenses => {
      this.expenses = expenses;
    });

    this.fetchApiData.getAllSales().subscribe(sales => {
      this.sales = sales;
    });

    this.fetchApiData.getAllSupplies().subscribe(supplies => {
      this.supplies = supplies;
    });

    this.fetchExpenseData();
  }

  /**
   * Fetch sales and expense data for chart
   */
  fetchExpenseData(): void {
    let salesData: any[];
    let expensesData: any[];

    this.fetchApiData.getAllSales().subscribe(
      (sales: any[]) => {
        salesData = sales;

        this.fetchApiData.getAllExpenses().subscribe(
          (expenses: any[]) => {
            expensesData = expenses;
  
            this.populateChartOptions(salesData, expensesData);
          },
          (error: any) => {
            console.error('Error fetching expenses data:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching sales data:', error);
      }
    );
  }
  
  getProducts(): void {
    this.fetchApiData.getAllProducts().subscribe((resp: any) => {
      this.products = resp;
      return this.products;
    });
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

  /**
   * Map sales and expenses on graph
   * @param sales sales data
   * @param expenses expenses data
   */
  populateChartOptions(sales: any[], expenses: any[]): void {
    this.chartOptions = {
      title: {
        text: 'Profit'
      },
      axisX: {
        title: 'Month'
      },
      axisY: {
        title: 'Amount'
      },
      toolTip: {
        shared: true
      },
      data: [{
        type: 'spline',
        name: 'Expenses',
        dataPoints: expenses.map(expense => ({
          label: expense.ExpenseDate,
          y: expense.Amount
        }))
      },
      {
        type: 'spline',
        name: 'Sales',
        dataPoints: sales.map(sale => ({
          label: sale.SaleDate,
          y: sale.Amount
        }))
      }
    
    ]
    }
  }

}
