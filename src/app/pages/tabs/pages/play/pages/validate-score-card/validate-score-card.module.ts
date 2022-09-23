import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateScoreCardPageRoutingModule } from './validate-score-card-routing.module';

import { ValidateScoreCardPage } from './validate-score-card.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateScoreCardPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ValidateScoreCardPage]
})
export class ValidateScoreCardPageModule {}
