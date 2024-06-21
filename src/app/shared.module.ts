import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

//Import shared components
import { NavHeaderComponent } from './shared/components/nav-header/nav-header.component';
import { LoginCardComponent } from './shared/components/login-card/login-card.component';
import { ProductCardComponent } from './shared/components/product-card/product-card.component';
import { PostComponent } from './shared/components/post/post.component';
import { PurchaseCardComponent } from './shared/components/purchase-card/purchase-card.component';

@NgModule({
  declarations: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent,
    PostComponent,
    PurchaseCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
  ],
  exports: [
    NavHeaderComponent,
    ProductCardComponent,
    LoginCardComponent,
    PostComponent,
    PurchaseCardComponent
  ]
})
export class SharedModule { }
