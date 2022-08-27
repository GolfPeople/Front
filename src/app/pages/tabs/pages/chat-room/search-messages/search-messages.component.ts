import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';

@Component({
  selector: 'app-search-messages',
  templateUrl: './search-messages.component.html',
  styleUrls: ['./search-messages.component.scss'],
})
export class SearchMessagesComponent implements OnInit {

  loading: boolean;
  messages = [];
  chats = [];
  text = '';

  constructor(
    private modalController: ModalController,
    public chatSvc: ChatService,
    private router: Router
  ) { }

  ngOnInit() { }


  close() {
    this.modalController.dismiss();
  }

  goToChat(chatId) {
    this.router.navigateByUrl('/tabs/chat-room/messages/' + chatId + '/x');
    this.close();
  }

  goToMsg(chatId, msgId) {
    this.router.navigateByUrl('/tabs/chat-room/messages/' + chatId + '/' + msgId);
    this.close();
  }


  search(event) {
    this.text = event.target.value;
    if (this.text) {
      this.messages = [];
      this.chats = [];
      this.loading = true;
      this.chatSvc.search(this.text).subscribe(res => {

        this.messages = res.map((msg, i) => {
          return {
            id: msg.id,
            message: msg.message.toLocaleLowerCase().replace(this.text, '<strong>' + this.text + '</strong>'),
            created_at: msg.created_at,
            user_id: msg.user.id,
            name: msg.user.name,
            user_img: msg.user.profile.photo,
            chatId: msg.sale_id,
            chat_img: msg.sala?.image,
            name_chat: msg.sala?.name_chat,
            type_id: msg.sala?.type_id
          }
        })
        this.loading = false;
      })

      this.chatSvc.searchUsers(this.text).subscribe(res => {
        this.chats = res.map(chat => {

          if(chat.type_id == 2){
            return{
              chatId: chat.id,
              type_id: chat.type_id,
              user: chat.user.filter(u => u.id !== JSON.parse(localStorage.getItem('user_id')))[0]              
            }
          }else{     
            
            return {
              chatId: chat.id,
              type_id: chat.type_id,
              users: chat.user.map(u => { return u.name}).toString().toLocaleLowerCase().replace(this.text, '<strong>' + this.text + '</strong>'),
              name_chat: chat.name_chat,
              chat_img: chat.image
            }
          }          
        })
        console.log(this.chats);
      })

    } else {
      this.chats = [];
      this.messages = [];
    }

  }
}
