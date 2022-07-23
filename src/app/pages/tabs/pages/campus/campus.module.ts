import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampusPageRoutingModule } from './campus-routing.module';

import { CampusPage } from './campus.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CampusMapModalComponent } from './components/campus-map-modal/campus-map-modal.component';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampusPageRoutingModule,
    ComponentsModule
  ],
  declarations: [CampusPage, CampusMapModalComponent],
})
export class CampusPageModule {}
