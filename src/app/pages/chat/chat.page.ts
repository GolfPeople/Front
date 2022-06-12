import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';

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
  @ViewChild(IonContent) content: IonContent

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
  }

  onSendMessage() {
    if (this.message !== '') {
      const msg = {
        message: this.message,
        user_id: this.myId,
      };
      this.messages.push(msg);
      this.content.scrollToBottom()
      this.chatSvc.sendMessage(this.id, this.message).subscribe((res) => {
        this.message = '';
        
        console.log(res);
        console.log(this.messages);
      });
    }
  }
}
