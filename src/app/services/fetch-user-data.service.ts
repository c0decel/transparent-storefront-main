import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FetchApiDataService } from './fetch-api-data.service';
import { FetchProductDataService } from './fetch-product-data.service';
import { User } from '../shared/models/user.model';

/**
 * Replace with your API URL
 */
const apiUrl = 'https://transparent-storefront-api-7a631c0a8a92.herokuapp.com';

@Injectable({
  providedIn: 'root'
})

export class FetchUserDataService {
    constructor(
        private http: HttpClient,
        public fetchApiData: FetchApiDataService,
        public fetchProductData: FetchProductDataService
        ) { }

    //Registration
    userRegistration(userDetails: any): Observable<any> {
        console.log(userDetails);
        return this.http.post(`${apiUrl}/users`, userDetails).pipe(
        catchError(this.handleError)
        );
    }

    //Login
    userLogin(loginData: any): Observable<any> {
        console.log('Log in: ', loginData);
        return this.http.post(`${apiUrl}/login`, loginData).pipe(
        catchError(this.handleError)
        );
    }

    //Get all users
    getAllUsers(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/users`, {
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
        return this.http.get(`${apiUrl}/users/name/` + user, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
            })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Get user by ID
    getUserByID(userID: string): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/users/id/` + userID, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
                })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    //Get current user notifications
    getNotifs(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/users/notifications`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    //Mark all as read
    markAsRead(): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.put(`${apiUrl}/users/notifications`, {}, {
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
        return this.http.delete(`${apiUrl}/users/` + toDelete, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Edit user bio
    editBio(updatedBio: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.put(`${apiUrl}/users/${user._id}/bio`, updatedBio, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
            );
    }

    //Edit user status
    editStatus(updatedStatus: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.put(`${apiUrl}/users/${user._id}/status`, updatedStatus, {
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
        return this.http.patch(`${apiUrl}/users/${userId}/toggle-sponsor`, {}, {
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
        return this.http.patch(`${apiUrl}/users/${userId}/toggle-admin`, {}, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Toggle posting
    togglePostPerms(userId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.patch(`${apiUrl}/users/${userId}/toggle-posting`, {}, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Get wishlist items
    getListItems(Username: string): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.get(`${apiUrl}/users/${Username}/wishlist`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Get user posts
    getUserPosts(): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.get(`${apiUrl}/users/${user.Username}/posts`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Get user profile comments
    getUserWall(username: string): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.get(`${apiUrl}/users/${username}/wall`, {
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

        this.fetchProductData.getOneProduct(_id).subscribe(
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

        return this.http.put(`${apiUrl}/users/${user.Username}/wishlist/${_id}`, {}, {
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

        return this.http.delete(`${apiUrl}/users/${user.Username}/wishlist/${_id}`, {
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

        return this.http.get(`${apiUrl}/users/${user.Username}/cart`, {
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

        this.fetchProductData.getOneProduct(_id).subscribe(
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

        return this.http.put(`${apiUrl}/users/${user.Username}/cart/${_id}`, {}, {
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

        return this.http.delete(`${apiUrl}/users/${user.Username}/cart/${_id}`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Get all purchases
    getUserPurchases(_id: string): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.get(`${apiUrl}/users/${user.Username}/purchases`, {
            headers: new HttpHeaders({
                Authorization: 'Bearer ' + token,
            })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    }

    //Get most recent purchase
    getMostRecentPurchase(): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.get(`${apiUrl}/users/${user.Username}/purchases/last`, {
            headers: new HttpHeaders({
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
          `Message: ${error.toString()}`
        ));
      }
}