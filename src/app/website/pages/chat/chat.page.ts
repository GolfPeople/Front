import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import Pusher from 'pusher-js';
import { switchMap } from 'rxjs/operators';
import { ChatService } from 'src/app/core/services/chat/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  id;
  username: string =''
  message: string = ''
  messages = []



  constructor(
    private chatSvc: ChatService,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit() {


    this.actRoute.params.subscribe(
      params => {
        console.log(params)
        this.id = params.id
        console.log(this.id)
      }
    )
    // this.actRoute.paramMap
    // .pipe(
    //   switchMap((param) => {
    //     this.id = param.get('id');
    //     console.log(this.id)
    //     return
    //   })
    // )

    Pusher.logToConsole = true;

    const pusher = new Pusher('e2c992d9f37f04e6829b', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('pusher:subscription_succeeded', (data) => {
      this.messages.push(data)
      alert(data);
      console.log(data)
    });


    

  }

  onSendMessage() {
    this.chatSvc.sendMessage(this.id, this.message).subscribe(res => {
      console.log(res)
      console.log(this.messages)
      this.message = ''
    })
  }
}
