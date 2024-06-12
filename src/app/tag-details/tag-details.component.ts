import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

//Import services
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { AuthService } from '../auth.service';

//Import models
import { Product } from '../shared/models/product.model';
import { Thread } from '../shared/models/thread.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-tag-details',
  templateUrl: './tag-details.component.html',
  styleUrls: ['./tag-details.component.scss']
})
export class TagDetailsComponent {
  user!: User;
  products: Product[] = [];
  threads: Thread[] = [];

  tagData: any;
  tagID!: string;

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
    this.user = this.authService.getUser();

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.route.paramMap.subscribe(params => {
      if (window.history.state && window.history.state.data) {
        this.tagData = window.history.state.data;
      }
        this.tagID = this.tagData._id;
        this.getProductsByTag(this.tagID);
        this.getThreadsByTag(this.tagID);
      }
    );
  }

  /**
   * Get products by tag
   * @param tagID tag ID
   */
  getProductsByTag(tagID: string): void {
    this.fetchProductData.getProductsByTag(tagID).subscribe(
      (products) => {
        this.products = products;
      },
      (error) => {
        console.log(`Couldn't fetch products: ${error}`)
      }
    )
  }

  /**
   * Get threads by tag
   * @param tagID tag ID
   */
  getThreadsByTag(tagID: string): void {
    this.fetchForumData.getThreadsByTag(tagID).subscribe(
      (threads) => {
        this.threads = threads;
      },
      (error) => {
        console.log(`Couldn't fetch threads: ${error}`)
      }
    )
  }

  /**
   * Open a thread
   * @param _id thread ID
   */
  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }
}
