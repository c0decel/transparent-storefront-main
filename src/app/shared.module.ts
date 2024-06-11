import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavHeaderComponent } from './shared/nav-header/nav-header.component';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [
    NavHeaderComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule
  ],
  exports: [
    NavHeaderComponent,
  ]
})
export class SharedModule { }
