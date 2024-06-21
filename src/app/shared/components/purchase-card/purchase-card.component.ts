import { Component, Input, OnInit } from '@angular/core';

//Import services
import { AuthService } from '../../../services/auth.service';

//Import models
import { Purchase } from '../../models/purchase.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-purchase-card',
  templateUrl: './purchase-card.component.html',
  styleUrls: ['./purchase-card.component.scss']
})
export class PurchaseCardComponent implements OnInit {
  user!: User;
  @Input() successfulPurchase!: Purchase;
  @Input() purchases: Purchase[] = [];
  @Input() singlePurchase: boolean = false;
  @Input() profileView: boolean = false;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }
}
