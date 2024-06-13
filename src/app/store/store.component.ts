import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchProductDataService } from '../services/fetch-product-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

//Import models
import { User } from '../shared/models/user.model';
import { Product } from '../shared/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  user!: User;
  products: Product[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public UtilsService: UtilsService,
    public fetchApiData: FetchApiDataService,
    public fetchProductData: FetchProductDataService,
    public fetchUserData: FetchUserDataService,
    public router: Router,
    public dialog: MatDialog,
    private modalService: ModalService,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.getProducts();
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  getProducts(): void {
    this.fetchProductData.getAllProducts().subscribe(
      (products) => {
      this.products = products;
      return this.products;
      },
      (error) => {
        console.log(`Error fetching products: ${error}`);
      }
    );
  }
}
