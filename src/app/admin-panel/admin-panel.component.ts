import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  isJanitor: boolean = false;
  products: any[] = [];
  user: any;
  users: any[] = [];
  newExpenseData: any = {Expense: '', Amount: '', Description: '', ExpenseDate: ''}
  newSaleData: any = {Sale: '', Amount: '', Description: '', SaleDate: ''}
  newTagData: any = {Tag: '', Description: ''}

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
    
    if (this.isJanitor == false) {
      this.router.navigate(['store']);
    }

    this.user = this.authService.getUser();

    this.fetchApiData.getAllUsers().subscribe(users => {
      this.users = users;
    });

    this.getProducts();
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

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['store']);
  }

  /**
 * Deletes a user after confirming with the user
 * @param toDelete User to delete
 */
  deleteOneUser(toDelete: string): void {

    const isConfirmed = confirm('Delete this user?');

    if (isConfirmed) {
      this.fetchApiData.deleteUser(toDelete).subscribe(() => {
        console.log(toDelete, ' deleted.');
      }, error => {
        console.error('Error deleting: ', error);
      });
    } else {
      console.log('Deletion canceled by user.');
    }
  }
  
  /**
   * Update user's sponsor status
   * @param userId To update
   */
  toggleSponsor(userId: string): void {

    const isConfirmed = confirm('Update sponsor status for this user?');

    if (isConfirmed) {
      this.fetchApiData.toggleSponsorStatus(userId).subscribe(() => {
        console.log(userId, ' updated.');
      }, error => {
        console.error('Error updating: ', error);
      });
    } else {
      console.log('Update canceled by user.');
    }

  }

  /**
   * Update user's admin status
   * @param userId To update
   */
  toggleAdmin(userId: string): void {

    const isConfirmed = confirm('Update admin status for this user?');

    if (isConfirmed) {
      this.fetchApiData.toggleAdminStatus(userId).subscribe(() => {
        console.log(userId, ' updated.');
      }, error => {
        console.error('Error updating: ', error);
      });
    } else {
      console.log('Update canceled by user.');
    }

  }


  /**
   * Deletes a product
   * @param toDelete Product to delete
   */
  deleteOneProduct(toDelete: string): void {
    this.fetchApiData.deleteProduct(toDelete).subscribe(() => {
      console.log(toDelete, ' deleted.');
    }, error => {
      console.error('Error deleting: ', error);
    });
  }

  postNewExpense(): void {
    this.fetchApiData.addNewExpense(this.newExpenseData).subscribe({
      next: (response) => {
        console.log('New expense added: ', response);
      },
      error: (error) => {
        console.error('Error: ', error);
      }
    });
  }

  postNewSale(): void {
    this.fetchApiData.addNewSale(this.newSaleData).subscribe({
      next: (response) => {
        console.log('New sale added: ', response);
      },
      error: (error) => {
        console.error('Error: ', error);
      }
    });
  }

  postNewTag(): void {
    this.fetchApiData.addNewTag(this.newTagData).subscribe({
      next: (response) => {
        console.log('New tag added: ', response);
      },
      error: (error) => {
        console.error('Error: ', error);
      }
    });
  }

}
