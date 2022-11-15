import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateScoreCardTournamentPageRoutingModule } from './validate-score-card-tournament-routing.module';

import { ValidateScoreCardTournamentPage } from './validate-score-card-tournament.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateScoreCardTournamentPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ValidateScoreCardTournamentPage]
})
export class ValidateScoreCardTournamentPageModule {}
