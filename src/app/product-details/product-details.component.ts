import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { Location } from '@angular/common';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { Thread } from '../models/thread.model';

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
  relatedThreads: any[] =[];
  supplies: any[]=[];
  newStock: any = {newStock: 0};


  constructor(
    public router: Router,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchProductData: FetchProductDataService,
    public fetchUserData: FetchUserDataService,
    public fetchForumData: FetchForumDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (window.history.state && window.history.state.data) {

        this.productData = window.history.state.data;
        const productName = this.productData.Name.toLowerCase();
        this.getReviews(this.productData._id);
        this.getTags(this.productData._id);
        this.getSupplies(this.productData._id);
        this.getRelatedThreads(productName);
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

  getRelatedThreads(productName: string): void {
    this.fetchForumData.getAllThreads().subscribe(
      (result: Thread[]) => {
        console.log(result);
        const relatedThreads = result.filter((thread) => {
          return thread.Title.includes(productName);
        });

        this.relatedThreads = relatedThreads;
        console.log(this.relatedThreads)
      },
      (error) => {
        console.error(`Error`);
      }
    )
  }

  getTags(productId: string): void {
    this.fetchProductData.getProductTags(productId).subscribe(
      (result: any) => {
        this.tags = result;
        console.log(this.tags);
      },
      (error) => {
        console.error(`Error fetching tags: ${error}`);
      }
    );
  }

  getSupplies(productId: string): void {
    this.fetchProductData.getProductSupplies(productId).subscribe(
      (result: any) => {
        this.supplies = result;
        console.log(this.supplies);
      },
      (error) => {
        console.error(`Error fetching supplies: ${error}`);
      }
    );
  }

  getReviews(productId: string): void {
    this.fetchApiData.getAllReviews(productId).subscribe(
      (result: any) => {
        this.reviews = result;
      },
      (error) => {
        console.error(`Error fetching reviews: ${error}`);
      }
    );
  }

  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }

  /**
 * Add item to cart
 * @param _id of item
 */
  addItemToCart(_id: string): void {
    this.fetchUserData.addToCart(_id).subscribe(
      (result) => {
        console.log(`Item added to cart: ${result}`);
        this.router.navigate(['cart']);
      },
      (error) => {
        alert(`There was an error.`)
        console.error(`Error adding item to cart: ${error}`);
      }
  );
  }

  /**
   * Add item to wishlist
   * @param _id of item
   */
  addItemToWishlist(_id: string): void {
    this.fetchUserData.addToList(_id).subscribe(
      (result) => {
        console.log(`Item added to wishlist: ${result}`);
        this.router.navigate(['cart']);
      },
      (error) => {
        alert(`There was an error.`)
        console.error(`Error adding item to wishlist: ${error}`);
      }
    );
  }

  updateStockQuantity(newStock: number, productId: string): void {
    console.log('New stock: ', newStock);
    this.fetchProductData.updateStock(newStock, productId).subscribe(
      (result: any) => {
        console.log(`New stock is: ${result}`);
        window.location.reload();
      },
      (error) => {
        alert(`There was an error.`)
        console.error(`Could not update stock: ${error}`);
      }
    )
  }

  submitReview(): void {
    this.reviewData.ProductID = this.productData._id;
    this.reviewData.UserID = this.user;
    this.reviewData.Username = this.user.Username;

    this.fetchApiData.addReview(this.reviewData).subscribe(
      (result) => {
        console.log(`Review added successfully: ${result}`);
        window.location.reload();
      },
      (error) => {
        console.error(`Error adding review: ${error}`);
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
