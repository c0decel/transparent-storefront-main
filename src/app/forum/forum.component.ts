import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { AuthService } from '../services/auth.service';

//Import models
import { User } from '../shared/models/user.model';
import { Thread } from '../shared/models/thread.model';
import { Tag } from '../shared/models/tag.model';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent {
  user!: User;
  threads: Thread[] = [];
  allTags: Tag[] = [];

  selectedTags: { [tagId: string]: boolean } = {};
  postData: any = { Title: '', UserID: '', Username: '', Content: '', Tags: []};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchForumData: FetchForumDataService,
    public utilsService: UtilsService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.user = this.authService.getUser();

      this.getTags();
      this.getThreads();
    }

    public isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }
    
    /**
     * Get all tags
     */
    getTags(): void {
      this.fetchApiData.getAllTags().subscribe(
        (tags) => {
          this.allTags = tags;
        },
        (error) => {
          console.log(`Couldn't fetch tags: ${error}`);
        }
      );
    }

    /**
     * Get all threads
     */
    getThreads(): void {
      this.fetchForumData.getAllThreads().subscribe(
        (threads) => {
          this.threads = threads;
        },
        (error) => {
          console.log( `Couldn't fetch threads: ${error}`);
        }
      );
    }

    /**
     * Select or unselect a tag
     * @param tagId selected tag
     */
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

      const selectedTags = this.allTags.filter(
        tag => this.selectedTags[tag.TagID]).map(tag => tag.TagID
        );
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

    /**
     * Open a thread
     * @param _id thread ID
     */
    openThread(_id: string): void {
      this.router.navigate(['/threads', _id])
    }
}
