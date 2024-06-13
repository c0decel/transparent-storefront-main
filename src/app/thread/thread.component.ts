import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { Ban } from '../shared/models/bans.model';
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

  modalOpen = false;

  BannedUser: string = '';
  BannedFrom: string = '';
  BannedForPost: string = '';
  BannedBy: string = '';

  threadData: any;

  reactionData: 'Like' | 'Dislike' | 'Userful' | 'Funny' | 'Dumb' | ''='';

  replyData: any = { ThreadID: '', UserID: '', Content: '', LikedBy: [], DislikedBy: [], PostedAtTime: '', PostedAtDate: '', PostBan: false};
  banData: any = {BannedBy: '', BannedForPost: '', BannedFrom: '', Reason: '', IssuedOn: new Date(), ExpiresOn: new Date(), BannedUser: ''};

  constructor(
    public router: Router,
    private authService: AuthService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public fetchApiData: FetchApiDataService,
    public fetchForumData: FetchForumDataService,
    public fetchUserData: FetchUserDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) { 
    this.registerIcons();
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

  getIconByType(type: string): string {
    let icon: string;

    switch (type) {
        case 'Like':
            icon = 'like_icon';
            break;
        case 'Dislike':
            icon = 'dislike_icon';
            break;
        case 'Useful':
            icon = 'useful_icon';
            break;
        case 'Funny':
            icon = 'funny_icon';
            break;
        case 'Dumb':
            icon = 'dumb_icon';
            break;
        default:
            icon = 'like_icon'; 
            break;
      }
      return icon;
  }


  registerIcons(): void {
    this.iconRegistry.addSvgIcon(
      'like_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/like.svg')
    );
    this.iconRegistry.addSvgIcon(
      'dislike_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/dislike.svg')
    );
    this.iconRegistry.addSvgIcon(
      'useful_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/useful.svg')
    );
    this.iconRegistry.addSvgIcon(
      'funny_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/funny.svg')
    );
    this.iconRegistry.addSvgIcon(
      'dumb_icon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/icons/dumb.svg')
    )
  }

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
            Icon: this.getIconByType(reaction.Type)
          }));
          console.log(reply.MostRecentReactions);
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
    this.router.navigate(['/profile', userId], {
      state: {
        data: {
          _id: userId
        }
      }
    })
  }

  /**
   * Open ban modal
   * @param userId user ID to ban
   * @param threadId thread ID to ban user from
   * @param replyId reply ID of post to ban
   */
  openBanModal(userId: string, threadId: string, replyId: string): void {
    this.modalOpen = true;

    this.BannedUser = userId;
    this.BannedFrom = threadId;
    this.BannedForPost = replyId;
    this.BannedBy = this.user._id;
    console.log(this.BannedBy)
    console.log(this.BannedUser)
    console.log(this.BannedFrom)
    console.log(this.modalOpen)
    console.log(`post ID: ${this.BannedForPost}`)
  }


  closeModal(): void {
    this.modalOpen = false;
    console.log(this.modalOpen)
  }

  /**
   * Ban user from thread
   * @param banData data of user to ban
   */
  banUser(banData: Ban): void {
    banData.BannedBy = this.user._id;
    banData.BannedFrom = this.BannedFrom;
    banData.BannedForPost = this.BannedForPost;
    banData.Reason = this.banData.Reason; 
    banData.IssuedOn = new Date();
    banData.ExpiresOn = this.banData.ExpiresOn; 
    banData.BannedUser = this.BannedUser;
    banData.PostBan = true;
    
  
    this.fetchForumData.banUser(banData).subscribe(
      (result) => {
        console.log(`User has been banned: ${result}`);
        console.log(`User banned for: ${banData.BannedForPost}`);
      },
      (error) => {
        console.error(`Error banning user: ${error}`);
      }
    );
  
    this.closeModal();
  }

  /**
   * Highlight or unhighlight a reply
   * @param postId 
   */
  toggleHighlight(postId: string): void {
    const isConfirmed = confirm(`Update highlight status for this post?`);

    if (isConfirmed) {
      this.fetchForumData.toggleHighlight(postId).subscribe(
        (result) => {
          console.log(`${postId} updated.`);
          window.location.reload();
        }, 
        (error) => {
          console.error(`Error updating: ${error}`);
        }
      );
    } else {
      console.log(`Update canceled by user.`);
    }
  }

  /**
   * Reply to a thread
   */
  postReply(): void {
    if (this.thread && this.thread._id && this.replyData.Content) {
  
      const replyData = {
        ThreadID: this.thread._id,
        UserID: this.user._id,
        Username: this.user.Username,
        Content: this.replyData.Content,
        LikedBy: [],
        DislikedBy: [],
        ReactionScore: 0
      };
  
      this.fetchForumData.postNewReply(replyData).subscribe(
        (result) => {
          console.log(`Response created successfully.`);
          window.location.reload();
        },
        (error) => {
          console.error(`Error adding response: ${error}`);
        }
      );
    } else {
      console.error('Thread ID, User ID, or reply content is missing.');
    }
  }
  
}


