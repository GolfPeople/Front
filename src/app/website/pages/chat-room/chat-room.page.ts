import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/core/services/chat/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';

  rooms: any = []



  constructor(
    public chatSvc: ChatService
  ) { }

  ngOnInit() {
    this.chatSvc.getRoom().subscribe(rooms => {
      console.log('Salas de shat', rooms)
      this.rooms = rooms
    })
  }

}
