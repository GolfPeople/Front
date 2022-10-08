import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameFinishedTournamentPageRoutingModule } from './game-finished-tournament-routing.module';

import { GameFinishedTournamentPage } from './game-finished-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GameFinishedTournamentPageRoutingModule,
    ComponentsModule
  ],
  declarations: [GameFinishedTournamentPage]
})
export class GameFinishedTournamentPageModule {}
