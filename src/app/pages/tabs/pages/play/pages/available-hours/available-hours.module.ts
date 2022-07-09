import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableHoursPageRoutingModule } from './available-hours-routing.module';

import { AvailableHoursPage } from './available-hours.page';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableHoursPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AvailableHoursPage]
})
export class AvailableHoursPageModule {}
