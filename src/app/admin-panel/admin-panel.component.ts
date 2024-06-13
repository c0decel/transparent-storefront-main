import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchProductDataService } from '../services/fetch-product-data.service';
import { FetchPaymentDataService } from '../services/fetch-payment-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Purchase } from '../shared/models/purchase.model';
import { User } from '../shared/models/user.model';
import { Product } from '../shared/models/product.model';


@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  user: User[]=[];
  products: Product[] = [];
  purchases: Purchase[] = [];
  users: User[]=[];

  isJanitor: boolean = false;

  newExpenseData: any = {Expense: '', Amount: '', Description: '', ExpenseDate: ''}
  newSaleData: any = {Sale: '', Amount: '', Description: '', SaleDate: ''}
  newTagData: any = {Tag: '', Description: ''}

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public utilsService: UtilsService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public fetchUserData: FetchUserDataService,
    public fetchPaymentData: FetchPaymentDataService,
    public fetchProductData: FetchProductDataService,
    public fetchApiData: FetchApiDataService,
  ) {}

  ngOnInit(): void { 
    this.user = this.authService.getUser();

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    } 
    
    if (this.isJanitor == false) {
      this.router.navigate(['store']);
    }

    this.getUsers();
    this.getProducts();
    this.getPurchases();
  }

  /**
   * Get users
   */
  getUsers(): void {
    this.fetchUserData.getAllUsers().subscribe(
      (users) => {
      this.users = users;
      },
      (error) => {
        console.log(`Error fetching users: ${error}`);
      }
    );
  }

  /**
   * Get products
   */
  getProducts(): void {
    this.fetchProductData.getAllProducts().subscribe(
      (products) => {
      this.products = products;
      return this.products;
      },
      (error) => {
        console.log(`Error fetching products: ${error}`);
      }
    );
  }

  /**
   * Get all purchases
   */
  getPurchases(): void {
    this.fetchPaymentData.getAllPurchases().subscribe(
      (purchases) => {
        this.purchases = purchases;
        return this.purchases;
      },
      (error) => {
        console.log(`Error fetching purchases: ${error}`);
      }
    );
  }

  /**
 * Deletes a user after confirming with the user
 * @param toDelete User to delete
 */
  deleteOneUser(toDelete: string): void {

    const isConfirmed = confirm(`Delete this user?`);

    if (isConfirmed) {
      this.fetchUserData.deleteUser(toDelete).subscribe(
      (result) => {
        alert(`${toDelete} deleted.`);
        console.log(result);
      }, 
      (error) => {
        console.error(`Error deleting: ${error}`);
      });
    } else {
      console.log(`Deletion canceled by user.`);
    }
  }
  
  /**
   * Update user's sponsor status
   * @param userId To update
   */
  toggleSponsor(userId: string): void {

    const isConfirmed = confirm(`Update sponsor status for this user?`);

    if (isConfirmed) {
      this.fetchUserData.toggleSponsorStatus(userId).subscribe(
      (result) => {
        alert(`${userId} updated.`);
        console.log(`Result: ${result}`)
      }, 
      (error) => {
        console.error(`Error updating: ${error}`);
      });
    } else {
      console.log(`Update canceled by user.`);
    }

  }

  /**
   * Update user's admin status
   * @param userId To update
   */
  toggleAdmin(userId: string): void {

    const isConfirmed = confirm(`Update admin status for this user?`);

    if (isConfirmed) {
      this.fetchUserData.toggleAdminStatus(userId).subscribe(
      (result) => {
        alert(`${userId} updated.`);
        console.log(`Result: ${result}`);
      }, 
      (error) => {
        console.error(`Error updating: ${error}`);
      });
    } else {
      console.log(`Update canceled by user.`);
    }

  }


  /**
   * Deletes a product
   * @param toDelete Product to delete
   */
  deleteOneProduct(toDelete: string): void {
    this.fetchProductData.deleteProduct(toDelete).subscribe(
    (result) => {
      alert(`${toDelete} deleted.`);
      console.log(`Result: ${result}`);
    },
    (error) => {
      console.error(`Error deleting: ${error}`);
    });
  }

  /**
   * Manually log new expense
   */
  postNewExpense(): void {
    this.fetchApiData.addNewExpense(this.newExpenseData).subscribe(
      (result) => {
        alert(`New expense added.`)
        console.log(`New expense added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }

  /**
   * Manually log new sale
   */
  postNewSale(): void {
    this.fetchApiData.addNewSale(this.newSaleData).subscribe(
      (result) => {
        alert(`New sale added.`)
        console.log(`New sale added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }

  /**
   * Post new tag
   */
  postNewTag(): void {
    this.fetchApiData.addNewTag(this.newTagData).subscribe(
      (result) => {
        alert(`New tag added.`)
        console.log(`New tag added: ${result}`);
      },
      (error) => {
        console.error(`Error: ${error}`);
      }
    );
  }
}
