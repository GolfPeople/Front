import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/core/services/chat/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
})
export class ChatRoomPage implements OnInit {
  avatar: string = 'assets/img/default-avatar.png';

  rooms: any = [];
  searchedRooms: any = []
  searchValue:string =''

  constructor(
    private chatSvc: ChatService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.chatSvc.getRoom().subscribe((rooms) => {
      console.log('Salas de chat', rooms);
      this.rooms = rooms;
      this.searchedRooms = rooms;
      loading.dismiss();
    });
  }

  searchRoom(value: string) {
    if(!(value.length >= 1)) {
      this.searchedRooms = this.rooms
    } else {
      this.searchedRooms = this.rooms.filter(room => room.user[0]?.name.includes(value))
    }
  } 
}
