import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
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
import { ForumComponent } from './forum/forum.component';
import { ProfileComponent } from './profile/profile.component';
import { ThreadComponent } from './thread/thread.component';
import { TagDetailsComponent } from './tag-details/tag-details.component';
import { ModLogComponent } from './mod-log/mod-log.component';
import { SuccessCheckoutComponent } from './success-checkout/success-checkout.component';
import { NotificationsComponent } from "./notifications/notifications.component";
import { SharedModule } from './shared.module';


const appRoutes: Routes = [
    { path: 'store', component: StoreComponent },
    { path: 'product-details/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'new-product', component: NewProductComponent },
    { path: 'admin-panel', component: AdminPanelComponent },
    { path: 'analytics-panel', component: AnalyticsPanelComponent },
    { path: 'discuss', component: ForumComponent },
    { path: 'profile/:id', component: ProfileComponent },
    { path: 'threads/:id', component: ThreadComponent },
    { path: 'tag-details/:id', component: TagDetailsComponent},
    { path: 'mod-log', component: ModLogComponent },
    { path: 'checkout/success', component: SuccessCheckoutComponent },
    { path: 'notifications', component: NotificationsComponent },
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
        ForumComponent,
        ProfileComponent,
        ThreadComponent,
        TagDetailsComponent,
        ModLogComponent,
        SuccessCheckoutComponent,
        NotificationsComponent
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
        SharedModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent]
})
export class AppModule { }