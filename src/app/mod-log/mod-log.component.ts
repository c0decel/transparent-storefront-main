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
import { Report } from '../shared/models/report.model';

@Component({
  selector: 'app-mod-log',
  templateUrl: './mod-log.component.html',
  styleUrls: ['./mod-log.component.scss']
})
export class ModLogComponent {
  user!: User;
  bans: Ban[] = [];
  users: User[] = [];
  reports: Report[] =[];

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
    this.getReports();
  }

  formatDate(date: Date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

  /**
   * Get all bans
   */
  getBans(): void {
    this.fetchApiData.getBans().subscribe(
      (bans) => {
        this.bans = bans.map((ban: Ban) => ({
          ...ban,
          formattedExpiresOn: this.formatDate(new Date(ban.ExpiresOn))
        }));
        console.log(this.bans);
        return this.bans;
      },
      (error) => {
        console.error(`Could not fetch bans: ${error}`);
      }
    );
  }

  getReports(): void {
    this.fetchApiData.getReports().subscribe(
      (reports) => {
        console.log(reports)
        this.reports = reports;
      },
      (error) => {
        console.error(`Could not fetch reports: ${error}`);
      }
    );
  }

  openProfile(userId: string): void {
    console.log(userId)
    this.router.navigate(['/profile', userId], {
      state: {
        data: {
          _id: userId
        }
      }
    })
  }
}
