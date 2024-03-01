import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { AuthService } from '../auth.service';

type User = { _id?: string, Username?: string, Cart?: any[]};

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  products: any[] = [];
  user: User = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
    const user = this.authService.getUser();
    console.log(user);

    if (!user._id) {
      this.router.navigate(['store']);
      return;
    }
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  public isSponsor(): boolean {
    return this.authService.isSponsor();
  }

  public isJanitor(): boolean {
    return this.authService.isJanitor();
  }

  getProducts(): void {
    this.fetchApiData.getAllProducts().subscribe((resp: any) => {
      this.products = resp;
      return this.products;
    });
  }

  /**
   * Open product details modal
   * @param _id ID
   * @param Name name
   * @param Price price
   * @param Description description
   * @param Image image path
   * @param Sales sales
   * @param Stock stock
   * @param Reviews reviews array
   */
  openDetails(_id: string, Name: string, Price: string, Description: string, Image: string, Sales: string, Stock: number, Reviews: {Rating: string, Username: string, Content: string}): void {
    this.router.navigate(['/product-details', _id], {
      state: {
        data: {
          _id: _id,
          Name: Name,
          Price: Price,
          Description: Description,
          Image: Image,
          Sales: Sales,
          Stock: Stock,
          Reviews: Reviews
        }
      }
    })
  }

  openCart(): void {
    this.router.navigate(['cart']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['admin-panel']);
  }

  goToAnalyticsPanel(): void {
    this.router.navigate(['analytics-panel']);
  }

  goToProductSubmit(): void {
    this.router.navigate(['new-product']);
  }

  goToLogin(): void {
    this.router.navigate(['login']);
  }

  goToSignup(): void {
    this.router.navigate(['sign-up']);
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['store']);
  }
/**
 * Add item to cart
 * @param _id of item
 */
  addItemToCart(_id: string): void {
    this.fetchApiData.addToCart(_id).subscribe({
      next: (response) => {
        console.log('Item added to cart:', response);
        this.router.navigate(['cart']);
      },
      error: (error) => {
        console.error('Error adding item to cart:', error);
      }
    });
  }

  /**
   * Add item to wishlist
   * @param _id of item
   */
  addItemToWishlist(_id: string): void {
    this.fetchApiData.addToList(_id).subscribe({
      next: (response) => {
        console.log('Item added to list:', response);
        this.router.navigate(['cart']);
      },
      error: (error) => {
        console.error('Error adding item to list:', error);
        // Optionally, display an error message to the user
      }
    });
  }

  
}
