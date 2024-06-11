import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FetchApiDataService } from '../fetch-api-data.service';
import { FetchUserDataService } from '../fetch-user-data.service';
import { FetchForumDataService } from '../fetch-forum-data.service';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Wishlist } from '../models/wishlist.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  isJanitor: boolean = false;
  user: User | null=null;
  currentUser: User | null = null;
  reactionScore: number = 0;
  wishlistItems: Wishlist[] = [];
  posts: any[] = [];
  @Input() updatedBio = { newBio: '' };
  @Input() updatedStatus = { newStatus: ''};
  userId: string | null = null;

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
        this.fetchUserData.getUserByID(this.userId).subscribe(
          (data) => {
            this.user = data;
            console.log(this.user)

          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
      }
    
    }

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

    public isLoggedIn(): boolean {
      return this.authService.isAuthenticated();
    }

    logOut(): void {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      this.authService.logout();
      this.router.navigate(['store']);
    }

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
        });
      } else {
        console.log(`Update canceled by user.`);
      }

    }

    togglePosting(userId: string): void {
      console.log(userId)

      const isConfirmed = confirm('Update posting status for this user?');

      if (isConfirmed) {
        this.fetchUserData.togglePostPerms(userId).subscribe(
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
     * Remove item from wishlist
     * @param item 
     */
    removeItemFromWishlist(item: Wishlist): void {
      const itemID: string = item.ProductID as string;
      this.fetchUserData.removeFromList(itemID).subscribe(() => {
        console.log('Removed from list.')
      })
    }

}
