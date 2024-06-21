import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../../../services/fetch-api-data.service';
import { FetchProductDataService } from '../../../services/fetch-product-data.service';
import { FetchUserDataService } from '../../../services/fetch-user-data.service';

//Import models
import { AuthService } from '../../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'nav-header-component',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.scss']
})
export class NavHeaderComponent implements OnInit {
  user!: User;

  menuActive: boolean = false;
  showLogin: boolean = false;
  newUser: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchProductData: FetchProductDataService,
    public fetchUserData: FetchUserDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  public isSponsor(): boolean {
    return this.authService.isSponsor();
  }

  public isJanitor(): boolean {
    return this.authService.isJanitor();
  }

  public currentUser(): string {
    return this.authService.getUser()._id;
  }

  getGridTemplateColumns(): string {
    return this.isLoggedIn() ? 'auto 25%' : 'auto 13%';
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  goToProfile(): void {
    const user = this.authService.getUser();
    console.log(user);
    if (user) {
      this.router.navigate(['/profile', user._id]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  goToNotifs(): void {
    this.router.navigate(['notifications']);
  }

  goToHome(): void {
    this.router.navigate(['store']);
  }

  openCart(): void {
    this.router.navigate(['cart']);
  }

  goToAdminPanel(): void {
    this.router.navigate(['admin-panel']);
  }

  goToAnalyticsPanel(): void {
    this.router.navigate(['analytics-panel']);
  }

  goToProductSubmit(): void {
    this.router.navigate(['new-product']);
  }

  goToLogin(): void {
    this.showLogin = !this.showLogin;
  }

  toggleNewUser(): void {
    this.newUser = !this.newUser;
  }

  goToSignup(): void {
    this.showLogin = !this.showLogin;
    this.toggleNewUser();
    console.log(this.newUser)
  }

  goToForum(): void {
    this.router.navigate(['discuss']);
  }

  logOut(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.authService.logout();
    this.router.navigate(['store']);
  }
}
