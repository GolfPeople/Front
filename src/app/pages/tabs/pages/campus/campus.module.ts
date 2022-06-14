import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampusPageRoutingModule } from './campus-routing.module';

import { CampusPage } from './campus.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampusPageRoutingModule,
    SharedModule,
  ],
  declarations: [CampusPage],
})
export class CampusPageModule {}
