import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoreCardPageRoutingModule } from './score-card-routing.module';

import { ScoreCardPage } from './score-card.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoreCardPageRoutingModule
  ],
  declarations: [ScoreCardPage]
})
export class ScoreCardPageModule {}
