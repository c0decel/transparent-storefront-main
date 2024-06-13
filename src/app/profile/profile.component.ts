import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { User } from '../shared/models/user.model';
import { Wishlist } from '../shared/models/wishlist.model';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser!: User;
  user!: User;
  wishlistItems: Wishlist[]=[];
  posts: Post[]=[];

  isJanitor: boolean = false;

  reactionScore!: number;
  userId: string | null=null;

  @Input() updatedBio = { newBio: '' };
  @Input() updatedStatus = { newStatus: ''};

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public fetchApiData: FetchApiDataService,
    public fetchUserData: FetchUserDataService,
    public fetchForumData: FetchForumDataService,
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public snackBar: MatSnackBar) { }

    ngOnInit(): void {
      this.userId = this.route.snapshot.paramMap.get('id');
      this.currentUser = this.authService.getUser();
      
      if (this.userId) {
        this.loadUserProfile(this.userId);
      }
    }
    
    /**
     * Load profile of selected user
     * @param userId user ID
     */
    loadUserProfile(userId: string): void {
      this.fetchUserData.getUserByID(userId).subscribe(user => {
        this.user = user;

        if (user && user.Posts) {
          this.posts = user.Posts;

          var totalLikes = 0
          var totalDislikes = 0

          for (const post of user.Posts) {
            totalLikes += post.LikedBy.length
            totalDislikes += post.DislikedBy.length
          } 

          this.reactionScore = totalLikes - totalDislikes;
        }

      })
    }

    /**
     * Update user bio
     */
    updateBio(): void {
      this.fetchUserData.editBio(this.updatedBio).subscribe(
        (result) => {
          this.user = result;
          alert(`Updated.`);
        }, 
        (error) => {
          alert(`Could not update bio.`);
          console.error(`Error updating: ${error}`);
        });
    }

    /**
     * Update user status
     */
    updateStatus(): void {
      this.fetchUserData.editStatus(this.updatedStatus).subscribe(
        (result) => {
          this.user = result;
          alert(`Updated.`);
        }, 
        (error) => {
          alert(`Could not update bio.`);
          console.error(`Error updating: ${error}`);
        });
    }

    /**
   * Update user's admin status
   * @param userId To update
   */
    toggleAdmin(userId: string): void {

      const isConfirmed = confirm('Update admin status for this user?');

      if (isConfirmed) {
        this.fetchUserData.toggleAdminStatus(userId).subscribe(
        (result) => {
          alert(`${userId} updated.`);
          console.log(`${userId} updated: ${result}`);
        }, 
        (error) => {
          alert(`Could not update ${userId}`);
          console.error(`Error updating ${userId}: ${error}`);
        });
      } else {
        console.log(`Update canceled by user.`);
      }

    }

    /**
   * Update user's sponsor status
   * @param userId To update
   */
    toggleSponsor(userId: string): void {
      console.log(userId)

      const isConfirmed = confirm('Update sponsor status for this user?');

      if (isConfirmed) {
        this.fetchUserData.toggleSponsorStatus(userId).subscribe(
          (result) => {
            alert(`${userId} updated.`);
            console.log(`${userId} updated: ${result}`);
          }, 
          (error) => {
            alert(`Could not update ${userId}`);
            console.error(`Error updating ${userId}: ${error}`);
          }
        );
      } else {
        console.log(`Update canceled by user.`);
      }
    }

    /**
     * Toggle user's posting ability
     * @param userId user ID
     */
    togglePosting(userId: string): void {
      console.log(userId)

      const isConfirmed = confirm('Update posting status for this user?');

      if (isConfirmed) {
        this.fetchUserData.togglePostPerms(userId).subscribe(
          (result) => {
            alert(`${userId} updated.`);
          }, 
          (error) => {
            alert(`Could not update ${userId}`);
            console.error(`Error updating ${userId}: ${error}`);
          }
        );
      } else {
        console.log(`Update canceled by user.`);
      }
    }

    /**
     * Remove item from wishlist
     * @param item 
     */
    removeItemFromWishlist(item: Wishlist): void {
      const itemID: string = item.ProductID as string;
      this.fetchUserData.removeFromList(itemID).subscribe(
        (result) => {
          console.log(`Removed from list.`)
        },
        (error) => {
          console.log(`Couldn't remove item from wishlist: ${error}`)
        }
      );
    }

}
