import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//Import services
import { FetchApiDataService } from '../services/fetch-api-data.service';
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { FetchForumDataService } from '../services/fetch-forum-data.service';
import { UtilsService } from '../shared/functions/utils.service';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

//Import models
import { User } from '../shared/models/user.model';
import { Wishlist } from '../shared/models/wishlist.model';
import { Post } from '../shared/models/post.model';
import { Purchase } from '../shared/models/purchase.model';

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
  profileComments: Post[]=[];
  userPurchases: Purchase[]=[];

  isJanitor: boolean = false;
  wishlistOpen: boolean = false;
  optionOpen: 'wall' | 'wishlist' | 'posts' | 'purchases' | '' = 'wall';
  newPicOpen: boolean = false;

  reactionScore: number=0 | 0;
  userId: string | null=null;

  @Input() updatedBio = { newBio: '' };
  @Input() updatedStatus = { newStatus: ''};

  selectedFile: File | null = null;
  uploadResponse: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    public modalService: ModalService,
    public utilsService: UtilsService,
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
        console.log(this.user)

        if (user) {
          this.fetchUserData.getListItems(this.user.Username).subscribe(
            (items: Wishlist[]) => {
              this.wishlistItems = items;
              console.log(`Wishlist Items: ${this.wishlistItems}`);
            }, 
            (error) => {
              console.error(`Could not fetch wishlist items: ${error}`);
            }
          );
        }

        if (user && user.Purchases) {
          this.userPurchases = user.Purchases;
        }

        if (user && user.Posts) {
          user.Posts.forEach((post: Post) => {
            post.MostRecentReactions = post.Reactions.slice(-3).reverse().map(reaction => ({
              Username: reaction.Username,
              Type: reaction.Type,
              Icon: this.utilsService.getIconByType(reaction.Type)
            }));
            console.log('reactikon score', post.ReactionScore, this.reactionScore)
            this.reactionScore += post.ReactionScore;
          });

          this.posts = user.Posts;

          
        }

        if (user && user.ProfileComments) {
          this.fetchUserData.getUserWall(this.user.Username).subscribe(
            (comments: Post[]) => {
              this.profileComments = comments;
            },
            (error) => {
              console.error(`Could not fetch profile comments: ${error}`);
            }
          )
        }

      });
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

    onFileSelected(event: any): void {
      const file: File = event.target.files[0];
      if (file) {
        this.selectedFile = file;
      }
    }
  
    onSubmit(): void {
      if (!this.selectedFile) {
        return;
      }
  
      const formData: FormData = new FormData();
      formData.append('image', this.selectedFile);
      console.log(this.selectedFile)
  
      this.fetchUserData.newProfilePic(formData).subscribe(
        (response) => {
          window.location.reload();
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
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

    openTab(optionType: 'wall' | 'wishlist' | 'posts' | 'purchases'): void {
      this.optionOpen = optionType;
    }

    openNewPic(): void {
      this.newPicOpen = !this.newPicOpen;
    }


}
