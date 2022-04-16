import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { Step6PageRoutingModule } from './step6-routing.module';

import { Step6Page } from './step6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Step6PageRoutingModule,
    SharedModule,
  ],
  declarations: [Step6Page],
})
export class Step6PageModule {}