import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

//Import services
import { FetchUserDataService } from '../services/fetch-user-data.service';
import { AuthService } from '../services/auth.service';

//Import models
import { User } from '../shared/models/user.model';
import { Notification } from '../shared/models/notification.model';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  user!: User;
  notifs: Notification[]=[];

  constructor(
    public fetchUserData: FetchUserDataService,
    private authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();

    if (!this.user) {
      this.router.navigate(['store']);
    }

    this.getNotifs();
  }

  ngOnDestroy(): void {
    this.markAllAsRead();
  }

  /**
   * Get all current user notifications
   */
  getNotifs(): void {
    this.fetchUserData.getNotifs().subscribe(
      (items: Notification[]) => {
        this.notifs = items.sort((a, b) => {
          const aDate = new Date(`${a.NotifDate} ${a.NotifTime}`);
          const bDate = new Date(`${b.NotifDate} ${b.NotifTime}`);
          return bDate.getTime() - aDate.getTime();
        });
      },
      (error) => {
        console.error(`Could not fetch notifications: ${error}`);
      }
    );
  }

  public isLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.fetchUserData.markAsRead().subscribe(
      (result) => {
        console.log(`All marked as read.`);
      },
      (error) => {
        console.error(`Couldn't mark as read: ${error}`);
      }
    )
  }

  /**
   * Open user's profile
   * @param userId user ID
   */
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

  /**
   * Open thread
   * @param _id thread ID
   */
  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }
}
