import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit {

  @Input() data;
  avatarDefault = 'assets/img/default-avatar.png';
  message = '';
  messages = [];
  user_id: number;
  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.user_id = JSON.parse(localStorage.getItem('user_id'));
    this.getMessages();
  }

  newMessage() {
    let currentDate = new Date;

    let message = {
      chatId: this.data.sale_id,
      user_id: this.user_id,
      created_at: currentDate,
      message: this.message,
    }
    this.firebaseService.addToCollection('messages', message).then(res => {
      this.message = '';
    }, error => {
      this.firebaseService.Toast('El mensaje no se pudo enviar, intenta de nuevo.')
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
    this.modalController.dismiss();
  }

}
