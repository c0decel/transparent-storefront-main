import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchProductDataService } from '../fetch-product-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { Product } from '../models/product.model';
import { Ban } from '../models/bans.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-mod-log',
  templateUrl: './mod-log.component.html',
  styleUrls: ['./mod-log.component.scss']
})
export class ModLogComponent {
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
    this.fetchApiData.getBans().subscribe(
      (resp: any) => {
        this.bans = resp;
        return this.bans;

      },
      (error) => {
        console.error(`Could not fetch bans: ${error}`);
      }
    );
  }
}
