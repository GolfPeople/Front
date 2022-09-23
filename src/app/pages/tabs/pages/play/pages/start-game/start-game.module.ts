import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartGamePageRoutingModule } from './start-game-routing.module';

import { StartGamePage } from './start-game.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartGamePageRoutingModule,
    ComponentsModule
  ],
  declarations: [StartGamePage]
})
export class StartGamePageModule {}
