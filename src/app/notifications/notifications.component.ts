import { Component, OnInit, OnDestroy } from '@angular/core';
import { FetchUserDataService } from '../fetch-user-data.service';
import { AuthService } from '../auth.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { Notification } from '../models/notification.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  user: any;
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

  openThread(_id: string): void {
    this.router.navigate(['/threads', _id])
  }
}
