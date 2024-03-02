import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';


const apiUrl = 'https://transparent-storefront-api-7a631c0a8a92.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
    constructor(private http: HttpClient) { }

  //Registration
  userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //Login
  userLogin(loginData: any): Observable<any> {
    console.log('Log in: ', loginData);
    return this.http.post(apiUrl + 'login', loginData).pipe(
      catchError(this.handleError)
    );
  }


  //New product
  addNewProduct(productData: any): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'products', productData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //New supply
  addNewSupply(supplyData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'supplies', supplyData, {
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
    return this.http.put(apiUrl + 'products/' + productId, newStock, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }


  //Add review
  addReview(reviewData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'reviews', reviewData, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Get all products
  getAllProducts(): Observable<any> {
    return this.http.get(apiUrl + 'products');
  }

   //Get all supplies
   getAllSupplies(): Observable<any> {
    return this.http.get(apiUrl + 'supplies');
  }

  //Get all expenses
  getAllExpenses():Observable<any> {
    return this.http.get(apiUrl + 'expenses');
  }

   //Get all expenses
  getAllSales():Observable<any> {
    return this.http.get(apiUrl + 'sales');
  }

  //Get all tags
  getAllTags():Observable<any> {
    return this.http.get(apiUrl + 'tags');
  }

  //Get product tags
  getProductTags(productID: string): Observable<any> {
    return this.http.get(`${apiUrl}products/${productID}/tags`);
  }

  //Get product supplies
  getProductSupplies(productID: string): Observable<any> {
    return this.http.get(`${apiUrl}products/${productID}/supplies`);
  }

  //Get all reviews
  getAllReviews(productId: string): Observable<any> {
    return this.http.get(`${apiUrl}reviews?ProductID=${productId}`);
  }

  //Get one product
  getOneProduct(_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'products/' + _id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );

  }

  //Get one supply
  getOneSupply(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'supplies/' + id, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );

  }

  //Get all users
  getAllUsers(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get one user
  getUser(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + user, {
      headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Delete user
  deleteUser(toDelete: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + toDelete, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Toggle sponsor
  toggleSponsorStatus(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(apiUrl + `users/${userId}/toggle-sponsor`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Toggle admin
  toggleAdminStatus(userId: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.patch(apiUrl + `users/${userId}/toggle-admin`, {}, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }
  

  //Delete product
  deleteProduct(toDelete: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'products/' + toDelete, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Add item to wishlist
  addToList(_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.Wishlist) {
      user.Wishlist = [];
    }

    this.getOneProduct(_id).subscribe(
      (product: any) => {
        const newItem = {
          _id: product._id,
          Name: product.Name,
          Price: product.Price,
          Image: product.Image
        };

        user.Wishlist.push(newItem);
        localStorage.setItem('user', JSON.stringify(user));
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );

    return this.http.put(apiUrl + `users/${user.Username}/wishlist/${_id}`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }


  //Remove from wishlist
  removeFromList(_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http.delete(apiUrl + `users/${user.Username}/wishlist/${_id}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get cart items
  getCartItems(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http.get(apiUrl + 'users/' + user.Username + '/cart', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Get wishlist items
  getListItems(): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http.get(apiUrl + 'users/' + user.Username + '/wishlist', {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Add item to cart
  addToCart(_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!user.Cart) {
      user.Cart = [];
    }

    this.getOneProduct(_id).subscribe(
      (product: any) => {
        const newItem = {
          _id: product._id,
          Name: product.Name,
          Price: product.Price,
          Image: product.Image
        };

        user.Cart.push(newItem);
        localStorage.setItem('user', JSON.stringify(user));
      },
      (error) => {
        console.error('Error fetching product details:', error);
      }
    );

    return this.http.put(apiUrl + `users/${user.Username}/cart/${_id}`, {}, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Remove from cart
  removeFromCart(_id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return this.http.delete(apiUrl + `users/${user.Username}/cart/${_id}`, {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //Submit new expense
  addNewExpense(expenseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'expenses', expenseData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Submit new sale
  addNewSale(saleData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'sales', saleData, {
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
    return this.http.post(apiUrl + 'tags', tagData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Add tags to product
  addTagToProduct(productID: string, tagID: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`/api/products/${productID}/tags/${tagID}`, {}, {
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
    return this.http.put<any>(`/api/products/${productID}/supplies/${supplyID}`, {}, {
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