import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ChatMessagesComponent } from '../../components/chat-messages/chat-messages.component';
import { SwiperOptions } from 'swiper';
@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';

  toggleOptions = { one: 'Mensajes', two: 'Actividad' }
  toggle$ = new BehaviorSubject(false);
  loading: boolean;
  uid: number;

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  filterSelected = 0;
  filteredChats = [];

  chatFilters = [
    { id: 0, name: 'Todo' },
    { id: 2, name: 'Amigos' },
    { id: 1, name: 'Grupos' },
    { id: 3, name: 'Clases' },
    { id: 4, name: 'Club' },
    { id: 5, name: 'Promoción' },
  ]

  constructor(
    public chatSvc: ChatService,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private friendsSvc: FriendsService,
    public notificationSvc: NotificationsService
  ) { }

  async ngOnInit() {
    this.getChatRooms();
    this.getFriends();
    this.getNotifications();
  }

  ionViewWillEnter() {
    this.uid = JSON.parse(localStorage.getItem('user_id'));
  }

  ionViewDidEnter() {
    this.getChatRooms();
    this.getNotifications();
  }

  ionViewWillLeave() {
    let activity = { id: this.uid.toString(), user_id: this.uid, notification: false }
    this.firebaseService.UpdateCollection('activity', activity);
  }

  filterChats(id) {
    this.filterSelected = id;
    if (id == 0) {
      this.filteredChats = this.chatSvc.rooms$.value
    } else {
      this.filteredChats = this.chatSvc.rooms$.value.filter(c => { return c.type_id == id });
    }

  }


  cleanActivityNotifications() {
    if (this.toggle$.value) {
      let activity = { id: this.uid.toString(), user_id: this.uid, notification: false }
      this.firebaseService.UpdateCollection('activity', activity);
    }
  }

  getNotifications() {
    this.notificationSvc.noRead().subscribe(res => {

      this.notificationSvc.userNotifications$.next(res.map(notification => {
        return {
          id: notification.id,
          date: notification.created_at,
          data: notification.data.data
        }
      }))

    })
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  getFriends() {
    this.friendsSvc.searchFriend('').subscribe(res => {
      this.chatSvc.friends$.next(res.data);
    })
  }

  getChatRooms() {
    if (!this.filteredChats.length) {
      this.loading = true;
    }
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.loading = false;

      for (let r of rooms) {
        this.firebaseService.getCollectionConditional('messages',
          ref => ref
            .where('chatId', '==', r.id)
            .orderBy('created_at', 'desc')
            .limit(5))
          .subscribe(data => {
            let msg = data.map(e => {
              return {
                user_id: e.payload.doc.data()['user_id'],
                read: e.payload.doc.data()['read'],
                message: e.payload.doc.data()['message'],
                created_at: e.payload.doc.data()['created_at'],
              };
            });

            r.lastmsg = msg[0].message
            r.lastDate = msg[0].created_at.toDate();
            r.unreadMsg = msg.filter(message => { return message.read == false && message.user_id !== this.uid }).length;

          })
      }
      this.chatSvc.rooms$.next(rooms);
      this.filteredChats = rooms;

    });
  }


  async openChat(room, index) {
    const modal = await this.modalController.create({
      component: ChatMessagesComponent,
      componentProps: { data: room },
      cssClass: 'fullscreen-modal'
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.chatSvc.rooms$.value[index].lastmsg = data.lastmsg
    }
    this.ionViewDidEnter();
  }

  async searchMessage(value) {
    const modal = await this.modalController.create({
      component: ChatMessagesComponent,
      componentProps: { value },
      cssClass: 'messages-modal'
    });
    modal.present();
  }


}
