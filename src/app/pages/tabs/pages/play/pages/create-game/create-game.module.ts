import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateGamePageRoutingModule } from './create-game-routing.module';

import { CreateGamePage } from './create-game.page';
import { ComponentsModule } from '../../../../components/components.module';
import { SwiperModule } from 'swiper/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CreateGamePageRoutingModule,
    ComponentsModule,
    SwiperModule
  ],
  declarations: [CreateGamePage]
})
export class CreateGamePageModule {}
