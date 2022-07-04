import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ChatMessagesComponent } from '../../../components/chat-messages/chat-messages.component';


@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {

  loading: boolean;
  toggleOptions = {one: 'Nuevo Chat', two:'Nuevo Grupo'}
  toggle$ = new BehaviorSubject(false);
  
  constructor(
    public chatSvc: ChatService,
    private friendsSvc: FriendsService,
    private modalController: ModalController,
    private firebaseService: FirebaseService  
  ) { }

  ngOnInit() {
    if(this.chatSvc.rooms$.value.length == 0){
      this.getChatRooms();
      this.getFriends();
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getFriends();
      event.target.complete();
    }, 500)
  }

  getFriends() {
    this.loading = true;
    this.friendsSvc.searchFriend('').subscribe(res => {
      this.chatSvc.friends$.next(res.data);
      this.loading = false;
    })
  }
  

  getChatRooms(){
 
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      for (let r of rooms) {
        this.firebaseService.getCollectionConditional('messages',
          ref => ref
            .where('chatId', '==', r.sale_id)
            .orderBy('created_at','desc')
            .limit(5))
          .subscribe(data => {
            let msg = data.map(e => {
              return {
                user_id: e.payload.doc.data()['user_id'],
                read: e.payload.doc.data()['read'],
                message: e.payload.doc.data()['message'],
              };
            });              
              r.lastmsg = msg[0].message 
              r.unreadMsg = msg.filter(message => message.read == false && message.user_id !== JSON.parse(localStorage.getItem('user_id'))).length;                             
          })
      }     
      this.chatSvc.rooms$.next(rooms);  
      console.log(rooms);
           
    });
  }

  openSingleChatRoom(friend) {
    let roomOpened;
    for (let s of friend.salas) {
      roomOpened = this.chatSvc.rooms$.value.filter(room => room.sale_id == s.id)[0];
    }
    if (roomOpened) {
      this.openChat(roomOpened)
    } else {
      this.createSingleRoom(friend)
    }
  }

  createSingleRoom(friend) {
    let user = [];
    let room = {}
    user.push(friend.id)
    this.chatSvc.createChatRoom(user).subscribe(res => {
      console.log(res);
      room = {
        name: friend.name,
        photo: friend.profile.photo,
        sale_id: res.sala_id
      }
      this.openChat(room);
    }, error => {
      console.log(error);
    })
  }

  async openChat(room) {
    const modal = await this.modalController.create({
      component: ChatMessagesComponent,
      componentProps: { data: room },
      cssClass: 'messages-modal'
    });
    modal.present();

  }

  createGrupalChatRoom() {
    let users = this.chatSvc.friends$.value;
    let usersId = [];
    users = users.filter(e => {return e.isChecked == true})
    usersId = users.map(u => {return (u.id)})
    if(users.length > 1){    
     this.chatSvc.createChatRoom(usersId).subscribe(res => {
      console.log(res);
      //{sala_id: 26, message: 'Registro exitoso'}
    }, error => {
      console.log(error);
    })
    }else{
      this.firebaseService.Toast('El grupo debe tener al menos 2 miembros')
    }  
    
    
  }

}
