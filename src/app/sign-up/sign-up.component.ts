import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: ''};

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {}

  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe((result) => {
      console.log(result)
      this.router.navigate(['login']);
    });
  };
};
