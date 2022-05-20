import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { take, takeLast } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';
  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  posts: PostsResponse[];
  notifications: number;

  constructor(
    private userService: UserService,
    private postsSvc: PostsService,
    private modalCtrl: ModalController,
    private notificationsSvc: NotificationsService
  ) {
    this.userService.user$.subscribe((data) => {
      this.userName = data.name;
    });
    this.postsSvc.posts$.subscribe((data) => {
      this.posts = data.slice(0, 3);
    });
    this.notificationsSvc.noReadedNotifications$.subscribe(
      (res) => (this.notifications = res.length)
    );
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
    this.notificationsSvc.noReaedCount();
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsComponent,
      backdropDismiss: true,
      cssClass: 'create-post-modal',
    });
    await modal.present();
  }
}
