import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { AuthService } from '../auth.service';

type User = { _id?: string, Username?: string, Cart?: []};
type CartItem = {ProductID?: string, Name: string, Price: string, Image: string};
type WishlistItem = {ProductID?: string, Name: string, Price: string, Image: string};

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {
  user: User = {};
  cartItems: CartItem[] = [];
  wishlistItems: WishlistItem[] = [];

  constructor(
    public router: Router,
    public fetchApiData: FetchApiDataService, 
    private authService: AuthService) { }

    ngOnInit(): void {
      const user = this.authService.getUser();
      if (!user._id) {
        this.router.navigate(['store']);
        return;
      }
      this.fetchApiData.getCartItems().subscribe((items: CartItem[]) => {
        this.cartItems = items;
        console.log('Cart Items:', this.cartItems);
      });

      this.fetchApiData.getListItems().subscribe((items: WishlistItem[]) => {
        this.wishlistItems = items;
        console.log('Wishlist Items:', this.wishlistItems);
      });
    }

    public isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }

    /**
     * Remove item from cart
     * @param item 
     */

    removeItemFromCart(item: CartItem): void {
      const itemID: string = item.ProductID as string;
      this.fetchApiData.removeFromCart(itemID).subscribe(() => {
        console.log(itemID, ' removed from cart.')
      },
      (error) => {
        console.error('Cannot remove from cart: ', error)
      })
    }

    /**
     * Remove item from wishlist
     * @param item 
     */

    removeItemFromWishlist(item: WishlistItem): void {
      const itemID: string = item.ProductID as string;
      this.fetchApiData.removeFromList(itemID).subscribe(() => {
        console.log('Removed from list.')
      })
    }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['store']);
  }

  goToProfile(): void {
    this.router.navigate(['profile']);
  }

}
