import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { Product } from '../models/product.model';
import { Thread } from '../models/thread.model';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent {
  products: Product[] = [];
  threads: Thread[] = [];
  tagData: any;
  user: any;
  isJanitor: boolean = false;

  constructor(
    public router: Router,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchProductData: FetchProductDataService,
    public fetchForumData: FetchForumDataService,
    public fetchUserData: FetchUserDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (window.history.state && window.history.state.data) {
        this.tagData = window.history.state.data;
      }

      const tagID = this.tagData._id;
      this.fetchProductData.getProductsByTag(tagID).subscribe(products => {
        this.products = products;
        console.log(products[0])
      })

      this.fetchForumData.getThreadsByTag(tagID).subscribe(threads => {
        this.threads = threads;
        console.log(threads[0])
      })
    });

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.user = this.authService.getUser();
    console.log(this.user);
  }

  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }


}
