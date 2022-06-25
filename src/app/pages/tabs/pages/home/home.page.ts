import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take, takeLast } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { NotificationsComponent } from 'src/app/shared/components/notifications/notifications.component';
import { UserService } from '../../../../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string = '';
  cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  posts: PostsResponse[] = [];
  page = 1;
  isLoadingMore: boolean = false;
  people: Friend[] = [];
  peoplePage = 1;
  notifications: any;

  constructor(
    private userService: UserService,
    private postsSvc: PostsService,
    private modalCtrl: ModalController,
    private notificationsSvc: NotificationsService,
    private friendsSvc: FriendsService,
    private loadingCtrl: LoadingController
  ) {
    this.userService.user$.subscribe((data) => {
      this.userName = data.name;
    });
    // this.postsSvc.posts$.subscribe((data) => {
    //   this.posts = data.slice(0, 3);
    // });
    this.notificationsSvc.noReadedNotifications$.subscribe(
      (res) => (this.notifications = res.length)
    );
    // this.notifications = this.notificationsSvc.counter$;
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
    this.notificationsSvc.noReaedCount();

    this.friendsSvc.mayKnow(this.peoplePage).subscribe(({ data }) => {
      this.people = data;
    });

    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {
        this.posts = data;
        console.log(this.posts);
        this.page += 1;
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }

  async openNotifications() {
    const modal = await this.modalCtrl.create({
      component: NotificationsComponent,
      backdropDismiss: true,
      cssClass: 'create-post-modal',
    });
    await modal.present();
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {
        this.posts = this.posts.concat(data);
        this.isLoadingMore = false;
        if (data.length) {
          this.page += 1;
        }
      },
      (error) => {
        this.isLoadingMore = false;
        console.log(error);
      }
    );
  }
}
