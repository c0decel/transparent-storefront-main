import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Cart } from '../shared/models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private checkoutRequestSource = new Subject<Cart>();
  checkoutRequested$ = this.checkoutRequestSource.asObservable();

  requestCheckout(item: Cart): void {
    this.checkoutRequestSource.next(item);
  }
}
