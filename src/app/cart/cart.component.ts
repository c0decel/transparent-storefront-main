import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';

//Import services
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchPaymentDataService } from '../fetch-payment-data.service';
import { AuthService } from '../auth.service';

//Import models
import { Wishlist } from '../shared/models/wishlist.model';
import { Cart } from '../shared/models/cart.model';
import { ModalService } from '../modal.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {
  user!: User;
  cartItems: Cart[] = [];
  wishlistItems: Wishlist[] = [];

  stripePromise!: Promise<any>;

  checkoutDetails: any = { ProductID: '', successUrl: '', cancelUrl: '', UserID: ''};

  constructor(
    private modalService: ModalService,
    public router: Router,
    public fetchApiData: FetchApiDataService, 
    public fetchUserData: FetchUserDataService,
    public fetchPaymentData: FetchPaymentDataService,
    private authService: AuthService) { }

    ngOnInit(): void {
      this.stripePromise = loadStripe(environment.stripePublicKeyTEST);

      this.user = this.authService.getUser();

      if (!this.user) {
        this.router.navigate(['store']);
      }

      this.getCartItems();
      this.getListItems();
    }

    /**
     * Get current user's cart items
     */
    getCartItems(): void {
      this.fetchUserData.getCartItems().subscribe(
        (items: Cart[]) => {
            this.cartItems = items;
        }, 
        (error) => {
          console.error(`Couldn't fetch cart items: ${error}`);
        }
      );
    }

    /**
     * Get current user's wishlist items
     */
    getListItems(): void {
      this.fetchUserData.getListItems().subscribe(
        (items: Wishlist[]) => {
          this.wishlistItems = items;
          console.log(`Wishlist Items: ${this.wishlistItems}`);
        }, 
        (error) => {
          console.error(`Could not fetch wishlist items: ${error}`);
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
     * Purchase an item
     * @param item cart item to purchase
     * @returns Stripe checkout session
     */
    checkoutCart(item: Cart): void {
      if (!this.stripePromise) {
        console.error(`No stripe promise.`);
        return;
      }

      const ProductID: string = item.ProductID as string;
      this.checkoutDetails.ProductID = ProductID;
      this.checkoutDetails.successUrl = 'http://localhost:4200/checkout/success'
      this.checkoutDetails.cancelUrl = 'http://localhost:4200/'
      this.checkoutDetails.UserID = this.user._id;

      this.fetchPaymentData.getCheckoutSession(this.checkoutDetails).subscribe(

        (result) => {

          this.stripePromise.then((stripe) => {
            stripe.redirectToCheckout({ sessionId: result.id })
              .then((redirectToCheckoutResult: any) => {
                if (redirectToCheckoutResult.error) {
                  console.error(redirectToCheckoutResult.error.message);
                }
              })
          });
        },
        (error: any) => {
          console.error(`Error.`);
        }
      )
    }
}
