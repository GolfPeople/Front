import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameFinishedSuccessPageRoutingModule } from './game-finished-success-routing.module';

import { GameFinishedSuccessPage } from './game-finished-success.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameFinishedSuccessPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GameFinishedSuccessPage]
})
export class GameFinishedSuccessPageModule {}
