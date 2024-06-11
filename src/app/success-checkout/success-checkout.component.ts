import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Purchase } from '../models/purchase.model';

@Component({
  selector: 'app-success-checkout',
  templateUrl: './success-checkout.component.html',
  styleUrls: ['./success-checkout.component.scss']
})
export class SuccessCheckoutComponent {
  user: User | null=null;
  successfulPurchase: Purchase | null=null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchUserData: FetchUserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const _id = this.authService.getUser();

    this.fetchUserData.getMostRecentPurchase().subscribe(
      (purchase: Purchase) => {
        this.successfulPurchase = purchase;
        console.log(this.successfulPurchase)
      },
      (error) => {
        console.error(`Could not fetch.`)
      });
  }
}
