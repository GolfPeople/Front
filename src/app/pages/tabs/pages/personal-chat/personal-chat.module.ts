import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonalChatPageRoutingModule } from './personal-chat-routing.module';

import { PersonalChatPage } from './personal-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonalChatPageRoutingModule
  ],
  declarations: [PersonalChatPage]
})
export class PersonalChatPageModule {}
