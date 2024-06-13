import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

//Import shared components
import { NavHeaderComponent } from './shared/nav-header/nav-header.component';
import { LoginCardComponent } from './shared/login-card/login-card.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { PostComponent } from './shared/post/post.component';


@NgModule({
  declarations: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent,
    PostComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent,
    PostComponent
  ]
})
export class SharedModule { }
