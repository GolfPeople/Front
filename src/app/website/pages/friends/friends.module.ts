import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FriendsPageRoutingModule } from './friends-routing.module';

import { FriendsPage } from './friends.page';
import { FriendComponent } from './components/friend/friend.component';

import { SwiperModule } from 'swiper/angular';

const components = [FriendComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FriendsPageRoutingModule,
    SwiperModule,
  ],
  declarations: [FriendsPage, components],
})
export class FriendsPageModule {}
