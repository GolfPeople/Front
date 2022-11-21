import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ChatMessagesComponent } from '../../components/chat-messages/chat-messages.component';
import { SwiperOptions } from 'swiper';
import { SearchMessagesComponent } from './search-messages/search-messages.component';
import { ActivatedRoute } from '@angular/router';
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

  readNotifications = [];
  unreadNotifications = [];
  loadingNotifications: boolean;

  
  constructor(
    public chatSvc: ChatService,
    private firebaseService: FirebaseService,
    private modalController: ModalController,
    private friendsSvc: FriendsService,
    public notificationSvc: NotificationsService,
  ) {
   
  }

  async ngOnInit() {

  }

  ionViewWillEnter() {
    this.uid = JSON.parse(localStorage.getItem('user_id'));

  }



  ionViewDidEnter() {
    this.getChatRooms();
    this.getUnreadNotifications();
  }

  ionViewWillLeave() {
    let activity = { id: this.uid.toString(), user_id: this.uid, notification: false }
    this.firebaseService.addToCollectionById('activity', activity);
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
      this.firebaseService.addToCollectionById('activity', activity);
      this.unreadNotifications.map(res => {
      
        if(res.data.type !== 'games' 
        && res.data.type !== 'RequestGames' 
        && res.data.type !== 'friends'
        && res.data.type !== 'StatusGames'
        ){
          this.notificationSvc.markAsReadOne(res.id).subscribe()
          this.chatSvc.unreadActivityCounter$.next(this.chatSvc.unreadActivityCounter$.value - 1);
        } 
      })
    }
  }

  getUnreadNotifications() {

    this.loadingNotifications = true;
    this.notificationSvc.noRead().subscribe(res => {

      this.unreadNotifications = res.map(notification => {
        return {
          id: notification.id,
          date: notification.created_at,
          data: notification.data.data
        }
      })

      this.chatSvc.unreadActivityCounter$.next(this.unreadNotifications.length);
      
      console.log(this.unreadNotifications);
      
      this.getNotifications();
    })
  }

  getNotifications() {

    let notificationsId = this.unreadNotifications.map(res => { return (res.id) });

    this.notificationSvc.all().subscribe(res => {
      this.readNotifications = res.map(notification => {
        return {
          id: notification.id,
          date: notification.created_at,
          data: notification.data.data
        }
      }).filter(res => { return !notificationsId.includes(res.id) })


      console.log(this.readNotifications);
      this.loadingNotifications = false;
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
            })
            if(msg.length > 0) {
              r.lastmsg = msg[0].message
              r.lastDate = msg[0].created_at.toDate();
              r.unreadMsg = msg.filter(message => { return message.read == false && message.user_id !== this.uid }).length;
            }
          })
      }
      this.chatSvc.rooms$.next(rooms);
      this.filteredChats = rooms;

    });
  }


  async searchMessagesModal() {
    const modal = await this.modalController.create({
      component: SearchMessagesComponent,
      cssClass: 'modal-full'
    });

    await modal.present();

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
