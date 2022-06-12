import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import Pusher from 'pusher-js';
import { switchMap } from 'rxjs/operators';
import { Message } from 'src/app/core/models/chat.interface';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  id;
  myId;
  username: string = '';
  message: string = '';
  messages= [];
  avatar: string = 'assets/img/default-avatar.png';
  user: any = {};

  constructor(
    private chatSvc: ChatService,
    private actRoute: ActivatedRoute,
    private userSvc: UserService
  ) {
    this.myId = localStorage.getItem('user_id')
  }

  ngOnInit() {
    this.chatSvc
      .getRoom()
      .subscribe((res) => console.log('Salas de chat', res));

    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.id = param.get('id');
          console.log('ID del perfil del usuario', this.id);
          if (this.id) {
            return this.userSvc.getUser(this.id);
          }
          return null;
        })
      )
      .subscribe((user) => {
        this.user = user;
        if (user.profile.photo) {
          this.avatar = user.profile.photo;
        }
      });
    // this.actRoute.paramMap
    // .pipe(
    //   switchMap((param) => {
    //     this.id = param.get('id');
    //     console.log(this.id)
    //     return
    //   })
    // )

    // Pusher.logToConsole = true;

    // const pusher = new Pusher('e2c992d9f37f04e6829b', {
    //   cluster: 'us2'
    // });

    // const channel = pusher.subscribe('chat');
    // channel.bind('pusher:subscription_succeeded', (data) => {
    //   this.messages.push(data)
    //   alert(data);
    //   console.log(data)
    // });
  }

  onSendMessage() {
    if (this.message.length) {
      this.chatSvc.sendMessage(this.id, this.message).subscribe((res) => {
        this.message = '';
        console.log(res);
        console.log(this.messages);
      });
    }
  }
}
