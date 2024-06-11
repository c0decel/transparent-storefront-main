import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  products: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchProductData: FetchProductDataService,
    public fetchUserData: FetchUserDataService,
    public router: Router,
    public dialog: MatDialog,
    private modalService: ModalService,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getProducts();
    const user = this.authService.getUser();

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

  public currentUser(): string {
    return this.authService.getUser()._id;
  }

  getProducts(): void {
    this.fetchProductData.getAllProducts().subscribe(
    (resp: any) => {
      this.products = resp;
      return this.products;
    },
    (error) => {
      console.error(`Could not fetch: ${error}`);
    }
    );
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
  openDetails(_id: string, Name: string, Price: string, Description: string, Image: string, Sales: string, Stock: number, Upcharge: number, Supplies: {Name: string, Description: string, Cost: number, Quantity: string, Measurement: string, Supplier: string}, Reviews: {Rating: string, Username: string, Content: string}): void {
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
          Supplies: Supplies,
          Upcharge: Upcharge,
          Reviews: Reviews
        }
      }
    })
  }

/**
 * Add item to cart
 * @param _id of item
 */
  addItemToCart(_id: string): void {
    this.fetchUserData.addToCart(_id).subscribe(
      (result) => {
        console.log(`Item added to cart: ${result}`);
        this.modalService.openModal({
          title: 'Added to cart',
          content: 'Test'
        })
      },
      (error) => {
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
        this.modalService.openModal({
          title: 'Added to wishlist',
          content: 'Test'
        })
      },
      (error) => {
        console.error(`Error adding item to wishlist: ${error}`);
      }
    );
  }

  
}
