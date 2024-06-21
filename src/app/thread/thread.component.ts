import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Post } from '../shared/models/post.model';
import { Thread } from '../shared/models/thread.model';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {
  user!: User;
  users: User[] = [];
  replies: Post[] = [];
  thread!: Thread;

  isJanitor: boolean = false;

  threadData: any;

  reactionData: 'Like' | 'Dislike' | 'Userful' | 'Funny' | 'Dumb' | ''='';

  constructor(
    public router: Router,
    private authService: AuthService,
    public utilsService: UtilsService,
    public fetchApiData: FetchApiDataService,
    public fetchForumData: FetchForumDataService,
    public fetchUserData: FetchUserDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) { 
    this.utilsService.registerIcons();
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.getAllUsers();
    this.getThreadRoute();
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }


  /**
   * Get thread ID from route
   */
  getThreadRoute(): void {
    this.route.paramMap.subscribe(params => {
      const threadId = params.get('id');
      if (threadId) {
          this.getThread(threadId);
          this.getThreadReplies(threadId);
        }
      }
    );
  }

  /**
   * Get all users
   */
  getAllUsers(): void {
    this.fetchUserData.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.log(`Couldn't fetch users: ${error}`);
      }
    );
  }

  /**
   * Get current thread
   */
  getThread(threadId: string): void {
    this.fetchForumData.getOneThread(threadId).subscribe(
      (data) => {
        this.thread = data.thread;
        console.log(this.thread)
      },
      (error) => {
        console.log(`Couldn't fetch thread: ${error}`);
      }
    );
  }

  /**
   * Get thread replies
   */
  getThreadReplies(threadId: string): void { 
    this.fetchForumData.getAllReplies(threadId).subscribe(
      (replies: Post[]) => {
        replies.forEach((reply: Post) => {
          reply.MostRecentReactions = reply.Reactions.slice(-3).reverse().map(reaction => ({
            Username: reaction.Username,
            Type: reaction.Type,
            Icon: this.utilsService.getIconByType(reaction.Type)
          }));
        });
        
        this.replies = replies;
      },
      (error) => {
        console.error(`Error fetching replies: ${error}`);
      }
    );
  }

  /**
   * Open user profile
   * @param userId user ID
   */
  openProfile(userId: string): void {
    this.utilsService.openProfile(userId);
  }
}


