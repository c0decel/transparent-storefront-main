import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


import { FetchProductDataService } from '../../services/fetch-product-data.service';

import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  products: Product[]=[];

  constructor(
    public router: Router,
    public fetchProductData: FetchProductDataService
  ) { }

  /**
    * Open a thread
    * @param _id thread ID
  */
 
  goToAdminPanel(): void {
    this.router.navigate(['admin-panel']);
  }

  /**
   * Open user profile
   * @param userId user ID
   */
  openProfile(userId: string): void {
    this.router.navigate(['/profile', userId], {
      state: {
        data: {
          _id: userId
        }
      }
    })
  }

}
