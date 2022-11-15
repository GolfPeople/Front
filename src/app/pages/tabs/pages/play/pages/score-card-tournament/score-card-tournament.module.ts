import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoreCardTournamentPageRoutingModule } from './score-card-tournament-routing.module';

import { ScoreCardTournamentPage } from './score-card-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoreCardTournamentPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ScoreCardTournamentPage]
})
export class ScoreCardTournamentPageModule {}
