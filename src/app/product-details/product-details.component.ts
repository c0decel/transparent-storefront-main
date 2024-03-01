import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  productData: any;
  isJanitor: boolean = false;
  reviewData: any = {Rating: 0, UserID: '', Username: '', ProductID: '', Content: ''};
  user: any;
  reviews: any[] = [];
  tags: any[] = [];
  newStock: any = {newStock: 0}

  constructor(
    public router: Router,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (window.history.state && window.history.state.data) {
        this.productData = window.history.state.data;
        this.getReviews(this.productData._id);
        this.getTags(this.productData._id);
      }
    });

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.user = this.authService.getUser();
    console.log(this.user);
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getTags(productId: string): void {
    this.fetchApiData.getProductTags(productId).subscribe(
      (response: any) => {
        this.tags = response;
        console.log(this.tags);
      },
      (error) => {
        console.error('Error fetching tags:', error);
      }
    );
  }

  getReviews(productId: string): void {
    this.fetchApiData.getAllReviews(productId).subscribe(
      (response: any) => {
        this.reviews = response;
      },
      (error) => {
        console.error('Error fetching reviews:', error);
      }
    );
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
      }
    });
  }

  updateStockQuantity(newStock: number, productId: string): void {
    console.log('New stock: ', newStock);
    this.fetchApiData.updateStock(newStock, productId).subscribe(
      (response: any) => {
        console.log('New stock is: ', response);
      },
      (error) => {
        console.error('Could not update stock: ', error);
      }
    )
  }

  submitReview(): void {
    this.reviewData.ProductID = this.productData._id;
    this.reviewData.UserID = this.user;
    this.reviewData.Username = this.user.Username;

    this.fetchApiData.addReview(this.reviewData).subscribe(
      (response) => {
        console.log('Review added successfully:', response);
      },
      (error) => {
        console.error('Error adding review:', error);
      }
    )
  }

  logOut(): void {
    localStorage.clear();
    this.router.navigate(['store']);
  }
  
  closeDetails(): void {
    this.router.navigate(['store']);
  }
}
