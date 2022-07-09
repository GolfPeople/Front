import { Component, OnInit } from '@angular/core';
import { FriendsService } from 'src/app/core/services/friends.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';
  constructor(
    public notificationSvc: NotificationsService,
    private friendService: FriendsService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() { }

  async acceptRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.friendService.acceptRequest(e.connection_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de amistad aceptada')
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    })
  }

  async declineRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.friendService.declineRequest(e.connection_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de amistad rechazada')
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    })
  }

  async markOneAsRead(notificationId, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.notificationSvc.userNotifications$.value.splice(index, 1);
    this.notificationSvc
      .markAsReadOne(notificationId)
      .subscribe((res) => {
        console.log(res)
        loading.dismiss();
      });
  }
}
