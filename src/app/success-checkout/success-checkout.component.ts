import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

//Import services
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { User } from '../shared/models/user.model';
import { Purchase } from '../shared/models/purchase.model';

@Component({
  selector: 'app-success-checkout',
  templateUrl: './success-checkout.component.html',
  styleUrls: ['./success-checkout.component.scss']
})
export class SuccessCheckoutComponent {
  user!: User;
  successfulPurchase!: Purchase;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchUserData: FetchUserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user) {
      this.router.navigate(['store']);
    }

    this.getMostRecentPurchase();
  }

  /**
   * Get user's most recent purchase
   */
  getMostRecentPurchase(): void {
    this.fetchUserData.getMostRecentPurchase().subscribe(
      (purchase) => {
        this.successfulPurchase = purchase;
      },
      (error) => {
        console.error(`Could not fetch.`)
      }
    );
  }
}
