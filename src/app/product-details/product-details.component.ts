import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchProductDataService } from '../services/fetch-product-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Thread } from '../shared/models/thread.model';
import { User } from '../shared/models/user.model';
import { Review } from '../shared/models/review.model';
import { Tag } from '../shared/models/tag.model';
import { Supply } from '../shared/models/supply.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  user!: User;
  reviews: Review[]=[];
  tags: Tag[]=[];
  supplies: Supply[]=[];

  isJanitor: boolean = false;
  
  productData: any;
  relatedThreads: any[] =[];

  reviewData: any = {Rating: 0, UserID: '', Username: '', ProductID: '', Content: ''};
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
    this.user = this.authService.getUser();

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

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
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Get threads that mention product
   * @param productName name of product
   */
  getRelatedThreads(productName: string): void {
    this.fetchForumData.getAllThreads().subscribe(
      (result: Thread[]) => {
        console.log(result);
        const relatedThreads = result.filter((thread) => {
          return thread.Title.includes(productName);
        });
        this.relatedThreads = relatedThreads;
      },
      (error) => {
        console.error(`Error`);
      }
    )
  }

  /**
   * Get tags from product
   * @param productId product ID
   */
  getTags(productId: string): void {
    this.fetchProductData.getProductTags(productId).subscribe(
      (tags) => {
        this.tags = tags;
      },
      (error) => {
        console.error(`Error fetching tags: ${error}`);
      }
    );
  }

  /**
   * Get supplies from product
   * @param productId product ID
   */
  getSupplies(productId: string): void {
    this.fetchProductData.getProductSupplies(productId).subscribe(
      (supplies) => {
        this.supplies = supplies;
      },
      (error) => {
        console.error(`Error fetching supplies: ${error}`);
      }
    );
  }

  /**
   * Get reviews from product
   * @param productId product ID
   */
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

  /**
   * Open a thread
   * @param _id thread ID
   */
  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }

  /**
 * Add item to cart
 * @param _id of item
 */
  addItemToCart(_id: string): void {
    if (!this.user) {
      this.router.navigate(['login']);
    } else {
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
  }

  /**
   * Add item to wishlist
   * @param _id of item
   */
  addItemToWishlist(_id: string): void {
    if (!this.user) {
      this.router.navigate(['login']);
    } else {
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
  }

  /**
   * Update product stock
   * @param newStock new stock number
   * @param productId product ID
   */
  updateStockQuantity(newStock: number, productId: string): void {
    console.log('New stock: ', newStock);
    this.fetchProductData.updateStock(newStock, productId).subscribe(
      (result) => {
        console.log(`New stock is: ${result}`);
        window.location.reload();
      },
      (error) => {
        alert(`There was an error.`)
        console.error(`Could not update stock: ${error}`);
      }
    )
  }

  /**
   * Submit a review
   */
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
  
  /**
   * Go back to store
   */
  closeDetails(): void {
    this.router.navigate(['store']);
  }
}
