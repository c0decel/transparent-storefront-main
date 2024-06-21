import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

//Import services
import { FetchApiDataService } from '../../../services/fetch-api-data.service';
import { FetchUserDataService } from '../../../services/fetch-user-data.service';
import { AuthService } from '../../../services/auth.service';

@Injectable({providedIn: 'root'})

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.component.html',
  styleUrls: ['./login-card.component.scss']
})
export class LoginCardComponent implements OnInit {
  @Input() loginData = {Username: '', Password: ''};
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '', defaultNum: null as Number | null, image: null as File | null };
  @Input() newUser: boolean = false;
  @Input() isVisible: boolean = false;

  uploadPic: boolean = false;
  selectedProfilePic: number = 0 | 0;

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
    this.userData.defaultNum = this.selectedProfilePic;

    const formData = new FormData();
    formData.append('Username', this.userData.Username);
    formData.append('Password', this.userData.Password);
    formData.append('Email', this.userData.Email);
    formData.append('Birthday', this.userData.Birthday);
    formData.append('defaultNum', String(this.userData.defaultNum));
    if (this.userData.image) {
      formData.append('image', this.userData.image);
    }

    this.fetchUserData.userRegistration(formData).subscribe(
      (result) => {
        console.log(result);
        this.toggleNewUser();
      }, 
      (error) => {
        console.error(`Could not register: ${error}`);
      }
    );
  };

  toggleFileSelection(): void {
    this.uploadPic = !this.uploadPic;
    this.selectedProfilePic = 0;
    this.userData.defaultNum = 0;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file){
      this.userData.image = file;
    }
  };

  setSelectedProfilePic(newSelection: number): void {
    this.selectedProfilePic = newSelection;
    this.userData.defaultNum = newSelection;
  };
}
