import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Thread } from './shared/models/thread.model';


/**
 * Replace with your API URL
 */
const apiUrl = 'https://transparent-storefront-api-7a631c0a8a92.herokuapp.com';

@Injectable({
  providedIn: 'root'
})

export class FetchForumDataService {
    constructor(private http: HttpClient) { }


    //Get all threads
    getAllThreads(): Observable<any> {
        return this.http.get(`${apiUrl}/threads`);
    }

    //Get one thread
    getOneThread(threadId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/threads/${threadId}`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );

    }

    //Post thread OP
    postNewThread(postData: any): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/threads`, postData, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        )
    }

    //Reply to thread
    postNewReply(replyData: any): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/posts`, replyData, {
        headers: new HttpHeaders({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        )
    }


    //Get all replies to thread
    getAllReplies(threadId: string): Observable<any> {
        return this.http.get(`${apiUrl}/threads/${threadId}/replies`);
    }

    //Get all posts from one user
    getAllUserPosts(userId: string): Observable<any> {
        return this.http.get(`${apiUrl}/users/id/${userId}/posts`);
    }

    //Get one post
    getOnePost(postId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(`${apiUrl}/posts/${postId}`, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );

    }

    //Get threads by tag
    getThreadsByTag(tagID: string): Observable<Thread[]> {
        return this.http.get<Thread[]>(`${apiUrl}/threads/tags/${tagID}`);
      }

    //Toggle highlight
    toggleHighlight(postId: string): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.put(`${apiUrl}/posts/${postId}/toggle-highlight`, {}, {
        headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
        })
        }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
        );
    }

    //Like a post
    likePost(postId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        return this.http.put(`${apiUrl}/posts/${postId}/like/${user.Username}`, {}, { 
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              })
        }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
      }

    // Dislike a post
    dislikePost(postId: string): Observable<any> {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        return this.http.put(`${apiUrl}/posts/${postId}/dislike/${user.Username}`, 
            {}, 
            { 
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                })
            }
        ).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
        );
    } 

    //Ban user
    banUser(banData: any): Observable<any> {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');
        return this.http.post(`${apiUrl}/threads/${banData.BannedFrom}/bans/${banData.BannedUser}/${banData.BannedForPost}`, banData, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + token,
            })
            }).pipe(
            map(this.extractResponseData),
            catchError(this.handleError)
            )
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
            `Message: ${error.message}`
        ));
    }
}