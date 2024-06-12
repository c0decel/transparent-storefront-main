import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';


/**
 * Replace with your API URL
 */
const apiUrl = 'https://transparent-storefront-api-7a631c0a8a92.herokuapp.com';

@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
    constructor(private http: HttpClient) { }


  //Add review
  addReview(reviewData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/reviews`, reviewData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get all tags
  getAllTags():Observable<any> {
    return this.http.get(`${apiUrl}/tags`);
  }


  //Get all reviews
  getAllReviews(productId: string): Observable<any> {
    return this.http.get(`${apiUrl}/reviews?ProductID=${productId}`);
  }

  //Get all supplies
  getAllSupplies(): Observable<any> {
    return this.http.get(`${apiUrl}/supplies`);
  }

  //Get one supply
  getOneSupply(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${apiUrl}/supplies/${id}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );

  }

  //New supply
  addNewSupply(supplyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/supplies`, supplyData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get all expenses
  getAllExpenses():Observable<any> {
    return this.http.get(`${apiUrl}/expenses`);
  }

  //Submit new expense
  addNewExpense(expenseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/expenses`, expenseData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get all sales
  getAllSales():Observable<any> {
    return this.http.get(`${apiUrl}/sales`);
  }

  //Submit new sale
  addNewSale(saleData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/sales`, saleData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Submit new tag
  addNewTag(tagData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${apiUrl}/tags`, tagData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get all bans
  getBans():Observable<any> {
    return this.http.get(`${apiUrl}/bans`);
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