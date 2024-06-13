import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

//Import shared components
import { NavHeaderComponent } from './shared/nav-header/nav-header.component';
import { LoginCardComponent } from './shared/login-card/login-card.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';


@NgModule({
  declarations: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule
  ],
  exports: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent
  ]
})
export class SharedModule { }
