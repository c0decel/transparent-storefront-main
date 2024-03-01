import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FetchApiDataService } from './fetch-api-data.service';

type User = { _id?: string, Username?: string, Password?: string, Email?: string, Birthday?: string, Cart?: [], hasBroom?: boolean }

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User = {};

  constructor(
    private router: Router,
    public fetchApiData: FetchApiDataService
  ) {}

  public getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Method to check if the user is logged in
  public isAuthenticated(): boolean {
    const user = this.getUser();
    return !!user && !!Object.keys(user).length;
  }

  //Check if user is moderator
  public isJanitor(): boolean {
    const user = this.getUser();
    return !!user.hasBroom;
  }

  //Check if user is sponsor
  public isSponsor(): boolean {
    const user = this.getUser();
    return !!user.isSponsor;
  }


  // Method to log out the user
  public logout(): void {
    localStorage.clear();
  }
}
