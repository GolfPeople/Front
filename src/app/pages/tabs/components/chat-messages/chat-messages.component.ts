import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as firebase from 'firebase/compat/app'
import { ChatService } from 'src/app/core/services/chat/chat.service';
@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;
  
  @Input() data: any;
  avatarDefault = 'assets/img/default-avatar.png';
  message = '';
  messages = [];
  user_id: number;
  constructor(
    public chatSvc: ChatService,
    private modalController: ModalController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.user_id = JSON.parse(localStorage.getItem('user_id'));
    if (this.data.id) {
      this.getMessages();
      this.markAsRead();
      setTimeout(() => {
        this.content.scrollToBottom(10);
      }, 2000);
    }
  }

  ionViewWillLeave() {
    this.markAsRead();
  }

  markAsRead() {
    this.firebaseService.markAsRead(this.user_id, this.data.id)
  }

  goToUserProfile(id){   
    this.firebaseService.routerLink('/tabs/user-profile/'+id);
    this.close();
  }

  newMessage() {
    if (this.message) {

      let message = {
        chatId: this.data.id,
        user_id: this.user_id,
        created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: this.message,
        read: false
      }
      this.newMessageDB(message.message);
      this.firebaseService.addToCollection('messages', message).then(res => {
        
      }, error => {
        this.firebaseService.Toast('El mensaje no se pudo enviar, intenta de nuevo.')
      })
      
      this.message = '';    
    }
  }

  newMessageDB(message) {

    let data = {
      message: message,
      sale_id: this.data.id
    }
    let userId = this.data.user.filter(u => { return u.id !== this.user_id })[0].id;
    this.chatSvc.sendMessage(userId, data).subscribe(res => {
      console.log(res);
    })
  }

  getMessages() {
    this.firebaseService.getCollectionConditional('messages',
      ref => ref
        .where('chatId', '==', this.data.id)
        .orderBy('created_at', 'desc')
        .limit(20))
      .subscribe(data => {

        this.messages = data.map(e => {
          return {
            id: e.payload.doc.id,
            chatId: e.payload.doc.data()['chatId'],
            user_id: e.payload.doc.data()['user_id'],
            created_at: e.payload.doc.data()['created_at'],
            message: e.payload.doc.data()['message'],
          };
        }).filter(msg => {return msg.message !== 'ㅤ'}).reverse()
         
      setTimeout(() => {
        this.content.scrollToBottom(10);
      }, 1500);
        
        
      }, error => {
        console.log(error)
      });
  }

  close() {
    if (this.messages.length > 0) {
      this.modalController.dismiss({ lastmsg: this.messages[this.messages.length - 1].message });
    } else {
      this.modalController.dismiss();
    }

  }

}
