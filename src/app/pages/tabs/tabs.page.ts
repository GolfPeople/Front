import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { UserPublicData } from 'src/app/core/interfaces/interfaces';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { LoginService } from 'src/app/core/services/login.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { QrComponent } from './components/qr/qr.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  user: UserPublicData;

  userName: string;
  imageAvatarDefault = 'assets/img/default-avatar.png';

  profileImage;
  profileUrl: string = 'https://golf-people.web.app/tabs/user-profile';
  value;

  notification = new Audio('../../../assets/sounds/notification.mp3');


  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController,
    public chatSvc: ChatService,
    private firebaseService: FirebaseService
  ) {
    this.userService.user$.subscribe((data) => {
      this.user = data;
      this.value = `${this.profileUrl}/${data.id}`;
    });
    this.userService.userPhoto$.subscribe((photo) => {
      if (photo) this.profileImage = photo;
    });
  }

  ngOnInit() {
    this.getUserInfo();
    this.getChatRoomsNotifications()
    this.getActivityNotification();
    this.firebaseService.setPresence('online');
  }

  getUserInfo() {
    this.userService.getUserInfoToSave().subscribe((data) => {
      this.userService.user.next(data);
      this.userService.userPhoto.next(data.profile.photo);
    });
  }

  onLogout() {
    this.loginService.logout();
    this.firebaseService.logout()
  }

  /**=============Notificaciones de chats nuevas============== */
  getChatRoomsNotifications() {

    this.chatSvc.getRoom().subscribe((rooms: any) => {
      
      let roomsId = rooms.map(r => { return (r.id) });
      this.firebaseService.getCollectionConditional('messages',
        ref => ref
          .where('chatId', 'in', roomsId)
          .where('read', '==', false)
          .where('user_id', '!=', parseInt(localStorage.getItem('user_id'))))
        .subscribe(data => {
          let msg = data.map(e => {
            return {
              user_id: e.payload.doc.data()['user_id'],
              read: e.payload.doc.data()['read'],
              message: e.payload.doc.data()['message'],
            };
          })
          if (msg.length) {
            console.log('mensajes',msg.length);
            
            this.chatSvc.unread$.next(msg.length)
            this.notification.play();
          } else {
            this.chatSvc.unread$.next(0)
          }
        })        
    });
  }

/**=============Notificación de actividad nuevas============== */
  getActivityNotification() {
    this.firebaseService.getCollectionConditional('activity',
      ref => ref
        .where('notification', '==', true)
        .where('user_id', '==', JSON.parse(localStorage.getItem('user_id'))))
      .subscribe(data => {

        let notification = data.map(e => {
          return {
            user_id: e.payload.doc.data()['user_id'],
          };
        })
        if (notification.length > 0) {
          this.chatSvc.unreadActivity$.next(true)
          this.notification.play();
        } else {
          this.chatSvc.unreadActivity$.next(false)
        }
      })
  }

  async openQR() {
    const modal = await this.modalCtrl.create({
      component: QrComponent,
      backdropDismiss: true,
      cssClass: 'options_modal',
      componentProps: {
        qr: this.value,
      },
    });

    await modal.present();
  }

  openMenu() {
    this.menuCtrl.enable(true, 'main-menu');
    this.menuCtrl.open('main-menu');
  }
}
