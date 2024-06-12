import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FetchProductDataService } from '../../fetch-product-data.service';
import { FetchUserDataService } from '../../fetch-user-data.service';
import { ModalService } from '../../modal.service';
import { AuthService } from '../../auth.service';

import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit{
  @Input() products: Product[] = [];

  constructor(
    public router: Router,
    public fetchProductData: FetchProductDataService,
    public fetchUserData: FetchUserDataService,
    public modalService: ModalService

  ) {}
  ngOnInit(): void {

    console.log(this.products)
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

}
