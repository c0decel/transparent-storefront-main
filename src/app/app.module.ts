import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";

import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts";

import { AppComponent } from "./app.component";
import { StoreComponent } from "./store/store.component";
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { NewProductComponent } from './new-product/new-product.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AnalyticsPanelComponent } from './analytics-panel/analytics-panel.component';

const appRoutes: Routes = [
    { path: 'store', component: StoreComponent },
    { path: 'product-details/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'new-product', component: NewProductComponent },
    { path: 'admin-panel', component: AdminPanelComponent },
    { path: 'analytics-panel', component: AnalyticsPanelComponent },
    { path: '', redirectTo: 'store', pathMatch: 'prefix'}
];

@NgModule({
    declarations: [
        AppComponent,
        StoreComponent,
        ProductDetailsComponent,
        CartComponent,
        NewProductComponent,
        AdminPanelComponent,
        LoginComponent,
        SignUpComponent,
        AnalyticsPanelComponent,
    ],
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        MatFormFieldModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        CanvasJSAngularChartsModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }