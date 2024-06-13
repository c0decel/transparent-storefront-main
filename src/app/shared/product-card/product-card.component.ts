import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';

import { FetchProductDataService } from '../../services/fetch-product-data.service';
import { FetchUserDataService } from '../../services/fetch-user-data.service';
import { FetchPaymentDataService } from '../../services/fetch-payment-data.service';
import { ModalService } from '../../services/modal.service';
import { AuthService } from '../../services/auth.service';

import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { User } from '../models/user.model';
import { Wishlist } from '../models/wishlist.model';


import { CheckoutService } from '../../services/checkout.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit{
  user!: User;
  @Input() products: Product[]=[];
  @Input() cartItems: Cart[]=[];
  @Input() wishlistItems: Wishlist[]=[];
  @Input() itemType: 'product' | 'cart' | 'wishlist' | '' ='';
  @Input() secondItemType: 'product' | 'cart' | 'wishlist' | ''='';

  stripePromise!: Promise<any>;

  checkoutDetails: any = { ProductID: '', successUrl: '', cancelUrl: '', UserID: ''};

  constructor(
    public router: Router,
    private authService: AuthService,
    public checkoutService: CheckoutService,
    public fetchProductData: FetchProductDataService,
    public fetchPaymentData: FetchPaymentDataService,
    public fetchUserData: FetchUserDataService,
    public modalService: ModalService

  ) {}
  ngOnInit(): void {


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
          title: `Added to cart`,
          content: `Test`
        })
      },
      (error) => {
        console.error(`Error adding item to cart: ${error}`);
      }
    );
  }

  /**
    * Remove item from cart
    * @param item 
  */
  removeItemFromCart(item: Cart): void {
    const itemID: string = item.ProductID as string;
    this.fetchUserData.removeFromCart(itemID).subscribe(
    (result) => {
      console.log(`${itemID} removed from cart.`)
      this.modalService.openModal({
        title: `Removed from cart`,
        content: `Test`
      })
    },
    (error) => {
      console.error(`Cannot remove from cart: ${error}`)
    })
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
          title: `Added to wishlist`,
          content: `Test`
        })
      },
      (error) => {
        console.error(`Error adding item to wishlist: ${error}`);
      }
    );
  }

  /**
    * Remove item from wishlist
    * @param item 
  */
  removeItemFromWishlist(item: Wishlist): void {
    const itemID: string = item.ProductID as string;
    this.fetchUserData.removeFromList(itemID).subscribe(
      (result) => {
        console.log(`${itemID} removed from wishlist.`)
        this.modalService.openModal({
          title: `Removed from wishlist`,
          content: `Test`
        })
      },
      (error) => {
        console.error(`Cannot remove from wishlist: ${error}`)
      }
    )
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
  openDetails(
    _id: string,
    Name: string,
    Price: number,
    Description: string,
    Image: string,
    Sales: number,
    Stock: number,
    Upcharge: number,
    Supplies: [],
    Reviews: []
    ): void {
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
      }
    )
  }

  /**
     * Purchase an item
     * @param item cart item to purchase
     * @returns Stripe checkout session
     */
  checkoutCart(item: Cart): void {
      this.checkoutService.requestCheckout(item);
  }

}
