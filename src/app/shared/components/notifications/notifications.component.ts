import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Notification } from 'src/app/core/models/notifications.interface';
import { NotificationsService } from 'src/app/core/services/notifications.service';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Lazy, Navigation } from 'swiper';
import { Router } from '@angular/router';
import { FriendsService } from 'src/app/core/services/friends.service';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotificationsComponent implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;

  notifications: Notification[] = [];
  noReadedNotifications: any = [];
  notificationCounter: number;
  buttonsCondition: string = 'te envió una solicitud de amistad';

  noRead: boolean = true;
  all: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private notifocationsSvc: NotificationsService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private friendsSvc: FriendsService
  ) {
    this.notifocationsSvc.counter$.subscribe(
      (res) => (this.notificationCounter = res)
    );
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.notifocationsSvc.noReaed().subscribe((data) => {
      this.noReadedNotifications = data;
      console.log('REs-->', data);
    });
    this.notifocationsSvc.all().subscribe((data) => {
      this.notifications = data;
      console.log('Todas -->', data);
      loading.dismiss();
    });
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async markAsread() {
    this.notifocationsSvc.updateCounter(0);
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.notifocationsSvc.markAsRead().subscribe((res) => {
      console.log(res);
      this.notifocationsSvc.noReaed().subscribe((data) => {
        this.noReadedNotifications = data;
        console.log('REs-->', data);
      });
      this.notifocationsSvc.all().subscribe((data) => {
        this.notifications = data;
        console.log('REs-->', data);
        loading.dismiss();
      });
      this.notifocationsSvc.noReaedCount();
    });
  }

  onAccept(connectionId, i) {
    this.noReadedNotifications.splice(i, 1);
    this.friendsSvc.acceptRequest(connectionId).subscribe((res) => {
      console.log(res);
    });
  }

  onDecline(connectionId, i) {
    this.noReadedNotifications.splice(i, 1);
    this.friendsSvc.declineRequest(connectionId).subscribe((res) => {
      console.log(res);
    });
  }

  next() {
    this.swiper.swiperRef.slideNext(500);
    this.all = true;
    this.noRead = false;
    console.log(this.all, this.noRead);
  }

  prev() {
    this.swiper.swiperRef.slidePrev(500);
    this.all = false;
    this.noRead = true;
    console.log(this.all, this.noRead);
  }

  show(user, id) {
    this.router.navigate(['/tabs/post', user, id]);
    this.modalCtrl.dismiss();
  }

  // slideChangeNext() {
  //   this.all = true;
  //   this.noRead = false;
  // }
  // slideChangePrev(e) {
  //   console.log(e);
  //   this.all = false;
  //   this.noRead = true;
  //   console.log(this.all, this.noRead);
  // }
}
