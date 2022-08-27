import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  constructor(
    public notificationSvc: NotificationsService,
    private friendService: FriendsService,
    private firebaseService: FirebaseService,
    private gameSvc: GameService,
    private modalController: ModalController
  ) { }

  ngOnInit() { }

  goToUserProfile(id){   
    this.firebaseService.routerLink('/tabs/user-profile/'+id);   
  }

  goToPost(id){   
    this.firebaseService.routerLink('/tabs/post/'+id);   
  }

  async goToGame(game_id){
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
    this.friendService.acceptRequest(e.connection_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de amistad aceptada')
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    })
  }

  async declineFriendRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.friendService.declineRequest(e.connection_id).subscribe(res => {
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
  
  this.gameSvc.acceptOrDeclineJoinRequest(1,e.data.game_id, e.data.user_sender.id).subscribe(res => {        
    this.firebaseService.Toast('Solicitud de juego aceptada')
    this.markOneAsRead(e.id, index)
    loading.dismiss();
  }, error =>{
    this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
    console.log(error);      
    loading.dismiss();
  })
}


async declineJoinRequest(e, index) {
  
  const loading = await this.firebaseService.loader().create();
  await loading.present();
  this.gameSvc.acceptOrDeclineJoinRequest(2,e.data.game_id, e.data.user_sender.id).subscribe(res => {
    this.firebaseService.Toast('Solicitud de juego rechazada')
    this.markOneAsRead(e.id, index)
    loading.dismiss();
  }, error =>{
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
    
    this.gameSvc.acceptOrDeclineGameRequest(2,e.data.game_id).subscribe(res => {     
      this.firebaseService.Toast('Solicitud de juego aceptada')
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error =>{
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      console.log(error);      
      loading.dismiss();
    })
  }


  async declineGameRequest(e, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();
    this.gameSvc.acceptOrDeclineGameRequest(3,e.data.game_id).subscribe(res => {
      this.firebaseService.Toast('Solicitud de juego rechazada') 
      this.markOneAsRead(e.id, index)
      loading.dismiss();
    }, error =>{
      console.log(error);
      this.firebaseService.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }
//================================================================


  async markOneAsRead(notificationId, index) {
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.notificationSvc.userNotifications$.value.splice(index, 1);
    this.notificationSvc
      .markAsReadOne(notificationId)
      .subscribe((res) => {       
        loading.dismiss();
      });
  }
}
