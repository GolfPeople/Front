import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-personal-chat',
  templateUrl: './personal-chat.page.html',
  styleUrls: ['./personal-chat.page.scss'],
})
export class PersonalChatPage implements OnInit {
  @ViewChild(IonContent) content: IonContent
  id;
  myId;
  username: string = '';
  message: string = '';
  messages = [];
  avatar: string = 'assets/img/default-avatar.png';
  user: any = {};
  room: any;

  constructor(
    private chatSvc: ChatService,
    private actRoute: ActivatedRoute,
    private userSvc: UserService,
    private loadingCtrl: LoadingController,
    private _location: Location
  ) {
    this.myId = localStorage.getItem('user_id');
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.actRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.id = params.get('id');
          this.room = params.get('room');
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
        this.chatSvc.getChat(this.room).subscribe((room) => {
          console.log(room);
          loading.dismiss();
          this.messages = room;
          this.content.scrollToBottom();
          console.log(this.myId);
        });
      });
  }

  goBack() {
    this._location.back();
  }


  captureValue(value) {
    console.log(value)
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
