import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent {
  postData: any = { Title: '', UserID: '', Username: '', Content: '', Tags: []  }
  user: any;
  threads: any[] = [];
  allTags: any[] = [];
  selectedTags: { [tagId: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchForumData: FetchForumDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.user = this.authService.getUser();
      console.log(this.user.Username);

      this.fetchApiData.getAllTags().subscribe(allTags => {
        this.allTags = allTags;
      });

      this.fetchForumData.getAllThreads().subscribe(threads => {
        this.threads = threads;
      });

    }

    public isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }

    toggleTagSelection(tagId: string): void {
      this.selectedTags[tagId] = !this.selectedTags[tagId];
  
      if (!this.selectedTags[tagId]) {
        const index = this.postData.Tags.indexOf(tagId);
        if (index !== -1) {
          this.postData.Tags.splice(index, 1);
        }
      }
    }

    /**
     * Post a new thread
     */
    postThread(): void {
      this.postData.UserID = this.user;
      this.postData.Username = this.user.Username;

      const selectedTags = this.allTags.filter(tag => this.selectedTags[tag._id]).map(tag => tag._id);
      this.postData.Tags = selectedTags;
  
      this.fetchForumData.postNewThread(this.postData).subscribe(
        (result) => {
          console.log(`New thread posted: ${result}`);
          window.location.reload();
        },
        (error) => {
          console.error(`Error posting thread: ${error}`);
        }
      )
    }
    
    openThread(_id: string): void {
      this.router.navigate(['/threads', _id])
    }


}
