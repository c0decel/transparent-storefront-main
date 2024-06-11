import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchPaymentDataService } from '../fetch-payment-data.service';
import { AuthService } from '../auth.service';
import { environment } from '../../environments/environment';
import { loadStripe } from '@stripe/stripe-js';
import { Wishlist } from '../models/wishlist.model';
import { Cart } from '../models/cart.model';
import { ModalService } from '../modal.service';


type User = { _id?: string, Username?: string, Cart?: [], Purchases?: []};


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {
  checkoutDetails: any = { ProductID: '', successUrl: '', cancelUrl: '', UserID: ''}
  user: User = {};
  cartItems: Cart[] = [];
  wishlistItems: Wishlist[] = [];
  stripePromise!: Promise<any>;

  constructor(
    private modalService: ModalService,
    public router: Router,
    public fetchApiData: FetchApiDataService, 
    public fetchUserData: FetchUserDataService,
    public fetchPaymentData: FetchPaymentDataService,
    private authService: AuthService) { }

    ngOnInit(): void {
      this.stripePromise = loadStripe(environment.stripePublicKeyTEST);

      const user = this.authService.getUser();

      if (!user._id) {
        this.router.navigate(['store']);
        return;
      } else {
        this.user = user;
      }

      this.fetchUserData.getCartItems().subscribe(
      (items: Cart[]) => {
          this.cartItems = items;
          console.log(`Cart Items: ${this.cartItems[0].ProductID}`);
      }, 
      (error) => {
        console.error(`Could not fetch cart items: ${error}`);
      });

      this.fetchUserData.getListItems().subscribe(
      (items: Wishlist[]) => {
        this.wishlistItems = items;
        console.log(`Wishlist Items: ${this.wishlistItems}`);
      }, 
      (error) => {
        console.error(`Could not fetch wishlist items: ${error}`);
      });
    }

    public isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }

    /**
     * Remove item from cart
     * @param item 
     */
    removeItemFromCart(item: Cart): void {
      const itemID: string = item.ProductID as string;
      this.fetchUserData.removeFromCart(itemID).subscribe(
      () => {
        console.log(`${itemID} removed from cart.`)
        this.modalService.openModal({
          title: 'Removed from cart',
          content: 'Test'
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
      () => {
        console.log(`${itemID} removed from wishlist.`)
        this.modalService.openModal({
          title: 'Removed from wishlist',
          content: 'Test'
        })
      },
      (error) => {
        console.error(`Cannot remove from wishlist: ${error}`)
      })
    }

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

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['store']);
  }

}
