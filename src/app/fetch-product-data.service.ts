import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchApiDataService } from './fetch-api-data.service';
import { Product } from './models/product.model';


/**
 * Replace with your API URL
 */
const apiUrl = 'https://your-api.com/';

@Injectable({
  providedIn: 'root'
})

export class FetchProductDataService {

    constructor(
        private http: HttpClient,
        public fetchApiData: FetchApiDataService,
        ) { }

    //Get all products
    getAllProducts(): Observable<any> {
        return this.http.get(`${apiUrl}/products`);
    }

    //Get one product
    getOneProduct(_id: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/products/${_id}`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );

    }

    //New product
    addNewProduct(productData: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/products`, productData, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        )
    }

    //New discount
    addNewDiscount(discountData: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/products/discount`, discountData, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        )
    }

    //Update product stock
    updateStock(newStock: number, productId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put(`${apiUrl}/products/${productId}`, newStock, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        )
    }

    //Get product tags
    getProductTags(productID: string): Observable<any> {
        return this.http.get(`${apiUrl}/products/${productID}/tags`);
    }

    //Get product by tag
    getProductsByTag(tagID: string): Observable<Product[]> {
        return this.http.get<Product[]>(`${apiUrl}/products/tags/` + tagID);
      }

    //Get product supplies
    getProductSupplies(productID: string): Observable<any> {
        return this.http.get(`${apiUrl}/products/${productID}/supplies`);
    }

    //Delete product
    deleteProduct(toDelete: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.delete(`${apiUrl}/products/${toDelete}`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Add tags to product
    addTagToProduct(productID: string, tagID: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put<any>(`${apiUrl}/products/${productID}/tags/${tagID}`, {}, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );

    }

    //Add supplies to product
    addSupplyToProduct(productID: string, supplyID: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put<any>(`${apiUrl}/products/${productID}/supplies/${supplyID}`, {}, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
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
            'There was an error. Try again later.' + error
            ));
        }
}