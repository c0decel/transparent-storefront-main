import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchPaymentDataService } from '../services/fetch-payment-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Wishlist } from '../shared/models/wishlist.model';
import { Cart } from '../shared/models/cart.model';
import { ModalService } from '../services/modal.service';
import { User } from '../shared/models/user.model';

import { CheckoutService } from '../services/checkout.service';

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
    public checkoutService: CheckoutService,
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

      this.checkoutService.checkoutRequested$.subscribe(item => {
        this.checkoutCart(item);
      });
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
      this.fetchUserData.getListItems(this.user.Username).subscribe(
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

    handleCheckoutRequest(item: Cart): void {
      this.checkoutCart(item);
    }
}
