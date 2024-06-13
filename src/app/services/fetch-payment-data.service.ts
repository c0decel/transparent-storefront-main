import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchApiDataService } from './fetch-api-data.service';
import { FetchProductDataService } from './fetch-product-data.service';

/**
 * Replace with your API URL
 */
const apiUrl = 'https://transparent-storefront-api-7a631c0a8a92.herokuapp.com';
const stripeApiKey = 'pk_test_51OjvYuIlMN9otNsqVPYOO6T0nEAPiIggPkmj0l9kpqDHlscQ8b65sVwELJ4MoAf2MoGAXPpw0ODQC0PGHJRfrWV300rdfa3eJJ';

@Injectable({
  providedIn: 'root'
})

export class FetchPaymentDataService {
    constructor(
        private http: HttpClient,
        public fetchApiData: FetchApiDataService,
        public fetchProductData: FetchProductDataService
    ) {}

    //Get all purchases
    getAllPurchases(): Observable<any> {
      return this.http.get(`${apiUrl}/payment`);
    }

    //Checkout
    getCheckoutSession(checkoutDetails: any): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/payment/create-checkout-session`, checkoutDetails, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    private extractResponseData(res: any): any {
        const body = res;
        return body || { };
      }
    
    private handleError(error: HttpErrorResponse): any {
        if (error.error instanceof ErrorEvent) {
          console.error('There was an error: ', error.error.message);
        } else {
          console.error(
            `Error status code ${error.status}, ` +
            `Error body is: ${error.error}`
          );
        }
        return throwError(() => new Error(
          `Message: ${error.toString()}`
        ));
      }
}