import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginData = {Username: '', Password: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public router: Router) { }

    ngOnInit(): void { }

    /**
     * Log in user
     */
    loginUser(): void {
      this.fetchApiData.userLogin(this.loginData).subscribe({
        next: (result) => {
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          this.router.navigate(['store']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
    }
  
    goToSignup(): void {
      this.router.navigate(['sign-up']);
    };
  
  };