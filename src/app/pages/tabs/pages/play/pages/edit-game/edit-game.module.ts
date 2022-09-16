import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditGamePageRoutingModule } from './edit-game-routing.module';

import { EditGamePage } from './edit-game.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditGamePageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [EditGamePage]
})
export class EditGamePageModule {}
