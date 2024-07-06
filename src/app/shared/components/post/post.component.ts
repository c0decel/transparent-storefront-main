import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

//Import services
import { FetchForumDataService } from '../../../services/fetch-forum-data.service';
import { AuthService } from '../../../services/auth.service';
import { UtilsService } from '../../functions/utils.service';

//Import models
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Ban } from '../../models/bans.model';
import { Thread } from '../../models/thread.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit{
  @Input() replies: Post[]=[];
  @Input() userPosts: Post[]=[];
  @Input() user!: User;
  @Input() thread!: Thread;
  @Input() userProfileComments: Post[]=[];
  @Input() profileView: boolean = false;

  isJanitor: boolean = false;

  banModalOpen = false;
  reportModalOpen = false;


  BannedUser: string = '';
  BannedFrom: string = '';
  BannedForPost: string = '';
  BannedBy: string = '';

  

  threadData: any;

  replyData: any = { ThreadID: '', UserID: '', Content: '', LikedBy: [], DislikedBy: [], PostedAtTime: '', PostedAtDate: '', PostBan: false};
  banData: any = {BannedBy: '', BannedForPost: '', BannedFrom: '', Reason: '', IssuedOn: new Date(), ExpiresOn: new Date(), BannedUser: ''};
  commentData: any = { Content: ''};
  reportData: any = { PostID: '', ThreadID: '', UserID: '', ReportReason: ''};

  constructor(
    private authService: AuthService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public fetchForumData: FetchForumDataService,
    public utilsService: UtilsService,
    public router: Router
  ) {
    this.utilsService.registerIcons();
  }

  ngOnInit(): void {
    
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  /**
   * Open ban modal
   * @param userId user ID to ban
   * @param threadId thread ID to ban user from
   * @param replyId reply ID of post to ban
   */
  openBanModal(userId: string, threadId: string, replyId: string): void {
    this.banModalOpen = true;

    this.BannedUser = userId;
    this.BannedFrom = threadId;
    this.BannedForPost = replyId;
    this.BannedBy = this.user._id;
  }


  closeBanModal(): void {
    this.banModalOpen = false;
    console.log(this.banModalOpen)
  }

  /**
   * Ban user from thread
   * @param banData data of user to ban
   */
  banUser(banData: Ban): void {
    banData.BannedBy._id = this.user._id;
    banData.BannedFrom._id = this.BannedFrom;
    banData.BannedForPost._id = this.BannedForPost;
    banData.Reason = this.banData.Reason; 
    banData.IssuedOn = new Date();
    banData.ExpiresOn = this.banData.ExpiresOn; 
    banData.BannedUser._id = this.BannedUser;
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
  
    this.closeBanModal();
  }

  openReportModal(threadId: string, replyId: string): void {
    this.reportModalOpen = true;

    this.reportData.UserID = this.user._id;
    this.reportData.ThreadID = threadId;
    this.reportData.PostID = replyId;
  }

  reportPost(reportData: any): void {
    reportData.UserID = this.user._id;
    reportData.ThreadID = this.reportData.ThreadID;
    reportData.PostID = this.reportData.PostID;
    reportData.ReportReason = this.reportData.ReportReason;

    this.fetchForumData.reportPost(reportData).subscribe(
      (result) => {
        console.log(`Report submitted: ${result}`);
        this.reportModalOpen = false;
      },
      (error) => {
        console.error(`Error submitting report: ${error}`);
      }
    );
  }

  closeReportModal(): void {
    this.reportModalOpen = false;
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

  /**
   * Comment on user wall
   */
  postOnWall(): void {
    if (this.user && this.commentData.Content) {
      const commentData = {
        Content: this.commentData.Content
      };

      this.fetchForumData.postWallComment(commentData, this.user.Username).subscribe(
        (result) => {
          console.log(`Response created successfully.`);
          window.location.reload();
        },
        (error) => {
          console.error(error.toString());
        }
      );
    } else {
      console.error('Could not post.');
    }
  }
  
  /**
   * Like a post
   * @param postId ID of post to like
   */
  reactPost(postId: string, reactionData: 'Like' | 'Dislike' | 'Useful' | 'Funny' | 'Dumb'): void {

    this.fetchForumData.getOnePost(postId).subscribe(
      (post) => {
        this.fetchForumData.reactToPost(postId, reactionData).subscribe(
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

  /**
   * Open user profile
   * @param userId user ID
   */
  openProfile(userId: string): void {
    this.utilsService.openProfile(userId);
  }
}
