import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

//Import services
import { FetchApiDataService } from '../../fetch-api-data.service';
import { FetchUserDataService } from '../../fetch-user-data.service';
import { AuthService } from '../../auth.service';

@Injectable({providedIn: 'root'})

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss']
})
export class LoginCardComponent implements OnInit {
  @Input() loginData = {Username: '', Password: ''};
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};
  @Input() newUser: boolean = false;
  @Input() isVisible: boolean = false;

  constructor(
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchUserData: FetchUserDataService,
    public router: Router
  ) {}

  ngOnInit(): void {
    
  }

  toggleNewUser(): void {
    this.newUser = !this.newUser;
  }

  toggleVisibility() : void {
    this.isVisible = !this.isVisible;
  }

  closeCard(): void {
    this.isVisible = false;
  }

  loginUser(): void {
    this.fetchUserData.userLogin(this.loginData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.toggleVisibility();
      },
      (error) => {
        alert(`Login failed.`);
        console.error(`Login failed: ${error}`);
      }
    );
  };

  registerUser(): void {
    this.fetchUserData.userRegistration(this.userData).subscribe(
      (result) => {
        console.log(result);
        this.toggleNewUser();
      }, 
      (error) => {
        console.error(`Could not register: ${error}`);
      }
    );
  };
}
