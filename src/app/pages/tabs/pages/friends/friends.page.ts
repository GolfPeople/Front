import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';

import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';
import * as firebase from 'firebase/compat/app'
import { FirebaseService } from 'src/app/services/firebase.service';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  toggleUsersType = { one: 'Amigos', two: 'Personas' };
  toggleUsersType$ = new BehaviorSubject(false);

  users = []
  friends = [];

  loadingUsers: boolean;
  loadingFriends: boolean;

  user_id;

  search = '';

  constructor(
    private friendsSvc: FriendsService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    public chatSvc: ChatService
  ) { }

  async ngOnInit() {

  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  ionViewWillEnter() {
    this.user_id = JSON.parse(localStorage.getItem('user_id'));
    this.getChatRooms();
    this.searchUsersOrFriends();    
  } 

  searchUsersOrFriends() {
    this.getUsers();
    this.getFriends();
  }

  getUsers() {
    this.loadingUsers = true;
    this.friendsSvc.search(this.search).subscribe(res => {
      this.users = res.data.map(u => {
        return {
          id: u.id,
          name: u.name,
          profile: u.profile,
          friends: u.friends,
          salas: u.salas,
          pending: u.friends.filter(f => f.connections.status == 1 && f.connections.id == this.user_id).length
        }
      });     
      this.loadingUsers = false;
    })
  }

  getFriends() {
    this.loadingFriends = true;
    this.friendsSvc.searchFriend(this.search).subscribe(res => {
      this.friends = res.data;   
      this.loadingFriends = false;
    })
  }

  getChatRooms(){
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.chatSvc.rooms$.next(rooms)
    })
  }

  openSingleChatRoom(friend) {
    console.log(friend);
    
    let roomOpened;  
    
    for (let s of friend.salas) {
      let exist = this.chatSvc.rooms$.value.filter(room => { return room.id == s.id && s.type_id == 2 })[0];
      if (exist) {
        roomOpened = exist
      }
    }

    console.log(roomOpened);
    

    // if (roomOpened) {
    //   this.firebaseSvc.routerLink('/tabs/chat-room/messages/'+roomOpened.id+'/x');
    // } else {
    //   this.createSingleRoom(friend)
    // }
  }

  async createSingleRoom(friend) {     
    let data = {
      message: 'ㅤ',
      sale_id: null
    }
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.chatSvc.sendMessage(friend.id, data).subscribe((res: any) => {
      
      let message = {
        chatId: res.sala_id,
        user_id: JSON.parse(localStorage.getItem('user_id')),
        created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: 'ㅤ',
        read: true
      }
      this.firebaseSvc.addToCollection('messages', message).then(e => {        
        this.firebaseSvc.routerLink('/tabs/chat-room/messages/'+res.sala_id+'/x');
        loading.dismiss();
      }, error => {
        loading.dismiss();
      })   
    }, error => {
      loading.dismiss();
      console.log(error);
    })
  }




  /**===================Dejar de seguir============== */
  async confirmUnfollow(user) {
    console.log(user);
    
    // const modal = await this.modalController.create({
    //   component: AlertConfirmComponent,
    //   cssClass: 'alert-confirm',
    //   componentProps: {
    //     confirmText: 'Dejar de seguir',
    //     content: `¿Quieres dejar de seguir a ${(user.name)}?`
    //   }
    // });

    // modal.present();

    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.Unfollow(user)
    // }
  }

  async Unfollow(user) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.friendsSvc.declineRequest(user.id).subscribe(res => {
      console.log(res);
      this.ionViewWillEnter();
      this.firebaseSvc.Toast(`Haz dejado de seguir a ${(user.name)}`)
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo')
      loading.dismiss();
    })
  }



  /**===================Enviar solicitud de amistad y notificación en tiempo real============== */
  async confirmFriendRequest(user) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Enviar',
        content: `¿Quieres enviar una solicitud de amistad a ${(user.name)}?`
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.sendFriendRequest(user.id)
    }
  }

  async sendFriendRequest(userId) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.friendsSvc.friendRequest(userId).subscribe(res => {
      this.activityNotification(userId);
      this.ionViewWillEnter();
      this.firebaseSvc.Toast('Solicitud enviada con éxito')
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo')
      loading.dismiss();
    })
  }

  activityNotification(user_id) {
    let activity = { id: user_id.toString(), user_id: user_id, notification: true }
    this.firebaseSvc.addToCollectionById('activity', activity);
  }
}