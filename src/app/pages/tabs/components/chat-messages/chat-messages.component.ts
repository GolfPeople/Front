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
  @ViewChild(IonContent) content: IonContent;
  @Input() data;
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
    if(this.data.sale_id){
      this.getMessages();
      this.markAsRead();
    }    
  }

  ionViewWillLeave(){
    this.markAsRead();
  }

  markAsRead(){      
    this.firebaseService.markAsRead(this.user_id,this.data.sale_id)
  }

 
  newMessage() {
    let message = {
      chatId: this.data.sale_id,
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
    this.content.scrollToBottom();
  }

  newMessageDB(message){
   this.chatSvc.sendMessage(this.data.user_id, message).subscribe(res =>{
    console.log(res);    
   })
  }

  getMessages() {
    this.firebaseService.getCollectionConditional('messages',
      ref => ref
        .where('chatId', '==', this.data.sale_id)
        .orderBy('created_at')
        .limit(50))
      .subscribe(data => {

        this.messages = data.map(e => {
          return {
            id: e.payload.doc.id,
            chatId: e.payload.doc.data()['chatId'],
            user_id: e.payload.doc.data()['user_id'],
            created_at: e.payload.doc.data()['created_at'],
            message: e.payload.doc.data()['message'],
          };
        });
      
      }, error => {
        console.log(error)
      });
  }

  close() {
    this.modalController.dismiss({ lastmsg: this.messages[this.messages.length - 1].message });
  }

}
