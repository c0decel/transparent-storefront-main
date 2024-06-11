import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { Ban } from '../models/bans.model';
import { Post } from '../models/post.model';

interface Thread {
  Content: string;
  Highlighted: boolean;
  Replies: any[]; 
  ReplyCount: number;
  Tags: any[]; 
  Title: string;
  Username: string;
  __v: number;
  _id: string;
}

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})

export class ThreadComponent {
  replyData: any = { ThreadID: '', UserID: '', Content: '', LikedBy: [], DislikedBy: [], PostedAtTime: '', PostedAtDate: '', PostBan: false}
  thread: Thread | null = null;
  isJanitor: boolean = false;
  user: any;
  users: any[] = [];
  replies: Post[] = [];
  currentIndex: number = 0;
  modalOpen = false;
  BannedUser: string = '';
  BannedFrom: string = '';
  BannedForPost: string = '';
  BannedBy: string = '';
  banData: any = {BannedBy: '', BannedForPost: '', BannedFrom: '', Reason: '', IssuedOn: new Date(), ExpiresOn: new Date(), BannedUser: ''}

  constructor(
    public router: Router,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchForumData: FetchForumDataService,
    public fetchUserData: FetchUserDataService,
    public route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const threadId = params.get('id');
      if (threadId) {
        this.fetchForumData.getOneThread(threadId).subscribe(data => {
          this.thread = data.thread;
          console.log(this.thread)
        });

        this.fetchForumData.getAllReplies(threadId).subscribe(
          (result: any) => {
            this.replies = result;
            console.log(this.replies);
          },
          (error) => {
            console.error(`Error fetching replies: ${error}`);
          }
        );
      }
    });

    if (this.authService.isJanitor()) {
      this.isJanitor = true;
    }

    this.user = this.authService.getUser();
    console.log(this.user);

    this.fetchUserData.getAllUsers().subscribe(users => {
      this.users = users;
    });

    console.log(this.modalOpen);

  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  openProfile(userId: string): void {
    console.log(userId)
    this.router.navigate(['/profile', userId], {
      state: {
        data: {
          _id: userId
        }
      }
    })
  }

  openBanModal(userId: string, threadId: string, replyId: string): void {
    this.modalOpen = true;

    this.BannedUser = userId;
    this.BannedFrom = threadId;
    this.BannedForPost = replyId;
    this.BannedBy = this.user;
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

  banUser(banData: Ban): void {
    banData.BannedBy = this.user;
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
        console.log(`User banned for: ${banData.BannedForPost}`)
        
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
      this.fetchForumData.toggleHighlight(postId).subscribe(() => {
        console.log(`${postId} updated.`);
        window.location.reload();
      }, error => {
        console.error(`Error updating: ${error}`);
      });
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
  
      console.log(replyData);
  
      this.fetchForumData.postNewReply(replyData).subscribe(
        (result: any) => {
          console.log(`Response created successfully: ${result.message}`);
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
  
  

  likePost(postId: string): void {
    this.fetchForumData.getOnePost(postId).subscribe(
      (post) => {
        const user = this.authService.getUser();

          this.fetchForumData.likePost(postId).subscribe(
            (result) => {
              console.log(`Post liked successfully: ${result}`);
            },
            (error) => {
              console.error(`Error liking post: ${error}`);
            }
          );
        
      },
      (error) => {
        console.error(`Error fetching post: ${error}`);
      }
    );
  }

  dislikePost(postId: string): void {
    this.fetchForumData.getOnePost(postId).subscribe(
        (post) => {
                this.fetchForumData.dislikePost(postId).subscribe(
                    (result) => {
                      console.log(`Post disliked successfully: ${result}`);
                    },
                    (error) => {
                      console.error(`Error disliking post: ${error}`);
                    }
                );
            
        },
        (error) => {
          console.error(`Error fetching post: ${error}`);
        }
    );
  }


}


