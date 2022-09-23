import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { GameService } from 'src/app/core/services/game.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GameDetailPage } from '../../pages/play/pages/game-detail/game-detail.page';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';
  @Input() readNotifications;
  @Input() unreadNotifications;
  @Input() loading;


  notificationTypesWithBtn = ['games', 'RequestGames', 'friends', 'StatusGames']

  constructor(
    public notificationSvc: NotificationsService,
    private friendService: FriendsService,
    private firebaseService: FirebaseService,
    private gameSvc: GameService,
    private modalController: ModalController,
    public chatSvc: ChatService
  ) { }

  ngOnInit() { }

  goToUserProfile(id) {
    this.firebaseService.routerLink('/tabs/user-profile/' + id);
  }

  goToPost(id) {
    this.firebaseService.routerLink('/tabs/post/' + id);
  }


  async validateGame(e, index) {
    this.firebaseService.routerLink(`/tabs/play/game-finished-success/x/${e.data.game_id}`)
    this.markOneAsRead(e.id, index)
  }


  async goToGame(game_id) {
    const modal = await this.modalController.create({
      component: GameDetailPage,
      componentProps: { game_id },
      cssClass: 'modal-full'
    });

    await modal.present();

  }

  async acceptFriendRequest(e, index) {

    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.friendService.acceptRequest(e.data.connection_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de amistad aceptada')
      this.activityNotification(e.data.user_id) 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    })
  }

  async declineFriendRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.friendService.declineRequest(e.data.connection_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de amistad rechazada')
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    })
  }


  /**
   * 
   * @param e 
   * @param index 
   * Aceptar solicitud de juego. (Usuario que solicitó unirse a una partida)
   * ===========================================
   */
  async acceptJoinRequest(e, index) {

    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.gameSvc.acceptOrDeclineJoinRequest(1, e.data.game_id, e.data.user_sender.id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de juego aceptada')
      this.activityNotification(e.data.user_id) 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      console.log(error);
      loading.dismiss();
    })
  }


  async declineJoinRequest(e, index) {

    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.gameSvc.acceptOrDeclineJoinRequest(2, e.data.game_id, e.data.user_sender.id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de juego rechazada')
      this.activityNotification(e.data.user_id) 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      console.log(error);
      loading.dismiss();
    })
  }
  //================================================================



  /**
   * 
   * @param e 
   * @param index 
   * Aceptar solicitud de juego. (Usuario que se añadió a una partida)
   * ===========================================
   */
  async acceptGameRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.gameSvc.acceptOrDeclineGameRequest(2, e.data.game_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de juego aceptada')
      this.activityNotification(e.data.user_id) 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error => {
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      console.log(error);
      loading.dismiss();
    })
  }


  async declineGameRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.gameSvc.acceptOrDeclineGameRequest(3, e.data.game_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de juego rechazada')
      this.activityNotification(e.data.user_id) 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }
  //================================================================


  async markOneAsRead(notificationId, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.unreadNotifications.splice(index, 1);
    this.chatSvc.unreadActivityCounter$.next(this.chatSvc.unreadActivityCounter$.value - 1);
    this.notificationSvc
      .markAsReadOne(notificationId)
      .subscribe((res) => {
        loading.dismiss();
      });
  }



 /**
  * It adds a new activity to the activity collection in the database.
  * @param user_id - The user id of the user you want to send the notification to.
  */
  activityNotification(user_id) {
    let activity = { id: user_id.toString(), user_id: user_id, notification: true }
    this.firebaseService.addToCollectionById('activity', activity);
  }
}
