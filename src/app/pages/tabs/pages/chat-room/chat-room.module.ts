import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-room-routing.module';

import { ChatRoomPage } from './chat-room.page';
import { ComponentsModule } from '../../components/components.module';
import { SwiperModule } from 'swiper/angular';
import { SearchMessagesComponent } from './search-messages/search-messages.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPageRoutingModule,
    ComponentsModule,
    SwiperModule  
  ],
  declarations: [ChatRoomPage, SearchMessagesComponent]
})
export class ChatRoomPageModule {}
