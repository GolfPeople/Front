import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonList, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as firebase from 'firebase/compat/app'
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @ViewChild(IonContent, { static: true }) content: IonContent;
  @ViewChild(IonList, { read: ElementRef }) list: ElementRef;

  avatarDefault = 'assets/img/default-avatar.png';
  message = '';
  lastMessages = []
  messages = [];
  user_id: number;
  loading: boolean;
  id;
  id_msg;
  data;


  scrollEl = null;

  constructor(
    public chatSvc: ChatService,
    private modalController: ModalController,
    private actRoute: ActivatedRoute,
    private firebaseService: FirebaseService) {

    this.id = parseInt(this.actRoute.snapshot.paramMap.get('id'));
    this.id_msg = this.actRoute.snapshot.paramMap.get('id_msg');

  }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.getChatRoom();
    this.getMessages();
    this.getMessagesDB();
    this.markAsRead();
    this.user_id = JSON.parse(localStorage.getItem('user_id'))
  }


  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  ionViewWillLeave() {
    this.markAsRead();
  }

  markAsRead() {
    this.firebaseService.markAsRead(JSON.parse(localStorage.getItem('user_id')), this.id)
  }

  goToUserProfile(id) {
    this.firebaseService.routerLink('/tabs/user-profile/' + id);
  }

  newMessage() {
    if (this.message) {

      let message = {
        chatId: this.id,
        user_id: JSON.parse(localStorage.getItem('user_id')),
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

  getMessagesDB() {
    this.chatSvc.getChatMessages(this.id).subscribe(res => {

      this.lastMessages = res.reverse().slice(4).map(msg => {
        return {
          id: msg.id,
          chatId: msg.sale_id,
          message: msg.message,
          created_at: msg.created_at,
          user_id: msg.user_id
        }
      })

      console.log(this.lastMessages);
      
      this.scrollTo();
    })
  }

  scrollTo() {
    if (this.id_msg && this.id_msg !== 'x') {
      this.lastMessages.map((msg, index) => {

        if (msg.id == parseInt(this.id_msg)) {
          this.scrollEl = index;
        }
      });

      if (this.scrollEl !== null) {
        setTimeout(() => {
          let arr = this.list.nativeElement.children;
          let item = arr[this.scrollEl];
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
      } else {
        this.scrollBottom();
      }

    } else {
      setTimeout(() => {
        this.content.scrollToBottom(10);
      }, 1500);
    }
  }


  scrollBottom() {
    this.scrollEl = null;
    this.id_msg = 'x';
    this.content.scrollToBottom(1000);
  }

  newMessageDB(message) {

    let data = {
      message: message,
      sale_id: this.id
    }
    let userId = this.data.user.filter(u => { return u.id !== JSON.parse(localStorage.getItem('user_id')) })[0].id;
    this.chatSvc.sendMessage(userId, data).subscribe(res => {
      this.getMessagesDB();
    })
  }

  getMessages() {

    this.firebaseService.getCollectionConditional('messages',
      ref => ref
        .where('chatId', '==', this.id)
        .orderBy('created_at', 'desc')
        .limit(4))
      .subscribe(data => {

        this.messages = data.map(e => {
          return {
            id: e.payload.doc.id,
            chatId: e.payload.doc.data()['chatId'],
            user_id: e.payload.doc.data()['user_id'],
            created_at: e.payload.doc.data()['created_at'],
            message: e.payload.doc.data()['message'],
          };
        }).filter(msg => { return msg.message !== 'ㅤ' }).reverse()

        // setTimeout(() => {
        //   this.content.scrollToBottom(10);
        // }, 1500);


      }, error => {

        console.log(error)
      });
  }

  getChatRoom() {
    this.loading = true;
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.data = rooms.filter(res => res.id == this.id)[0];
      this.loading = false;
    });
  }

}