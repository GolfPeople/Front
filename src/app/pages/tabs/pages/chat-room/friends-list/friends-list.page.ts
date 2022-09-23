import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as firebase from 'firebase/compat/app'
import { UserService } from "src/app/core/services/user.service";
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.page.html',
  styleUrls: ['./friends-list.page.scss'],
})
export class FriendsListPage implements OnInit {

  loading: boolean;
  toggleOptions = { one: 'Nuevo Chat', two: 'Nuevo Grupo' }
  toggle$ = new BehaviorSubject(false);

  groupName: string;
  currentUserData;

  usersFiltered = [];
  searchResult: string = '';

  type: string;
  constructor(
    public chatSvc: ChatService,
    private friendsSvc: FriendsService,
    private firebaseService: FirebaseService,
    private alertCtrl: AlertController,
    private userSvc: UserService,
    private actRoute: ActivatedRoute
  ) {
    this.type = this.actRoute.snapshot.paramMap.get('type');
  }

  ngOnInit() {
    this.userSvc.getUser(JSON.parse(localStorage.getItem('user_id'))).subscribe(res => {
      this.currentUserData = res;
    })

    this.getUsers();

    if (this.chatSvc.rooms$.value.length == 0) {
      this.getChatRooms();
    }
  }

  ionViewWillEnter() {
    if (this.type == 'single') {
      this.toggle$.next(false);
    }
    if (this.type == 'group') {
      this.toggle$.next(true);
    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getUsers();
      event.target.complete();
    }, 500)
  }

  getUsers() {
    this.loading = true;
    this.friendsSvc.search('').subscribe(res => {
      this.chatSvc.friends$.next(res.data);
      this.usersFiltered = this.chatSvc.friends$.value
      this.loading = false;
    })
  }

  filterUsers() {
    if (this.searchResult) {
      this.usersFiltered = this.chatSvc.friends$.value.filter(user => {
        return user.name.toLocaleLowerCase().includes(this.searchResult.toLocaleLowerCase())
      })
    } else {
      this.usersFiltered = this.chatSvc.friends$.value
    }
  }

  getChatRooms() {

    this.chatSvc.getRoom().subscribe((rooms: any) => {
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
              };
            });
            r.lastmsg = msg[0].message
            r.unreadMsg = msg.filter(message => message.read == false && message.user_id !== JSON.parse(localStorage.getItem('user_id'))).length;
          })
      }
      this.chatSvc.rooms$.next(rooms);

    });
  }

  openSingleChatRoom(friend) {
    let roomOpened;

    for (let s of friend.salas) {
      let exist = this.chatSvc.rooms$.value.filter(room => { return room.id == s.id && s.type_id == 2 })[0];
      if (exist) {
        roomOpened = exist
      }
    }

    if (roomOpened) {
      this.firebaseService.routerLink('/tabs/chat-room/messages/' + roomOpened.id + '/x');
    } else {
      this.createSingleRoom(friend)
    }
  }

  async createSingleRoom(friend) {

    let data = {
      message: 'ㅤ',
      sale_id: null
    }
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.chatSvc.sendMessage(friend.id, data).subscribe((res: any) => {
      let message = {
        chatId: res.sala_id,
        user_id: JSON.parse(localStorage.getItem('user_id')),
        created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: 'ㅤ',
        read: true
      }
      this.firebaseService.addToCollection('messages', message).then(e => {
        this.firebaseService.routerLink('/tabs/chat-room/messages/' + res.sala_id + '/x');
        loading.dismiss();
      }, error => {
        loading.dismiss();
      })
    }, error => {
      loading.dismiss();
      console.log(error);
    })
  }


  async createGroupName() {
    let users = this.chatSvc.friends$.value.filter(e => { return e.isChecked == true });
    if (users.length > 1) {
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'Ingresa el nombre del grupo',
        backdropDismiss: false,
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Nombre del grupo'
          },
        ],
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: 'Aceptar',
            handler: (res) => {
              this.createGrupalChatRoom(res.name, users);
            }
          }
        ]
      });
      await alert.present();
    }
    else {
      this.firebaseService.Toast('El grupo debe tener al menos 2 miembros')
    }
  }

  async createGrupalChatRoom(groupName, users) {
    let usersId = [];
    usersId = users.map(u => { return (u.id) })
    let data = { users: usersId, name: groupName }
    const loading = await this.firebaseService.loader().create();
    await loading.present();

    this.chatSvc.createChatRoom(data).subscribe(res => {
      let room = {
        id: res.sala_id,
        lastmsg: 'ㅤ',
        name: groupName,
        user: users,
        type_id: 1
      }
      let message = {
        chatId: res.sala_id,
        user_id: JSON.parse(localStorage.getItem('user_id')),
        created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: 'ㅤ',
        read: true
      }
      this.firebaseService.addToCollection('messages', message).then(e => {
        this.firebaseService.routerLink('/tabs/chat-room/messages/' + res.sala_id + '/x');
        loading.dismiss();
      })

    }, error => {
      loading.dismiss();
      console.log(error);
    })
  }

}
