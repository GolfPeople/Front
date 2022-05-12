import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { IonicModule } from '@ionic/angular';

import { Step6PageRoutingModule } from './step6-routing.module';

import { Step6Page } from './step6.page';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    Step6PageRoutingModule,
    SharedModule,
    GooglePlaceModule,
  ],
  declarations: [Step6Page],
})
export class Step6PageModule {}
