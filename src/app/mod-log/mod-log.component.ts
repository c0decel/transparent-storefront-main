import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchProductDataService } from '../services/fetch-product-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Product } from '../shared/models/product.model';
import { Ban } from '../shared/models/bans.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-mod-log',
  templateUrl: './mod-log.component.html',
  styleUrls: ['./mod-log.component.scss']
})
export class ModLogComponent {
  user!: User;
  bans: Ban[] = [];
  users: User[] = [];

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

    this.getBans();
  }

  /**
   * Get all bans
   */
  getBans(): void {
    this.fetchApiData.getBans().subscribe(
      (bans) => {
        this.bans = bans;
        return this.bans;
      },
      (error) => {
        console.error(`Could not fetch bans: ${error}`);
      }
    );
  }
}
