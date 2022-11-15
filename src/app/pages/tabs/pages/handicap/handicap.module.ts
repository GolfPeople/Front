import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HandicapPageRoutingModule } from './handicap-routing.module';

import { HandicapPage } from './handicap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HandicapPageRoutingModule
  ],
  declarations: [HandicapPage]
})
export class HandicapPageModule {}
