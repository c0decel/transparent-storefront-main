import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './shared/nav-header/nav-header.component';
import { ProductCardComponent } from './shared/product-card/product-card.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    NavHeaderComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    NavHeaderComponent,
    ProductCardComponent
  ]
})
export class SharedModule { }
