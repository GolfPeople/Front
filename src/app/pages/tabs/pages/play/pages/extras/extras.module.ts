import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtrasPageRoutingModule } from './extras-routing.module';

import { ExtrasPage } from './extras.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtrasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ExtrasPage]
})
export class ExtrasPageModule {}
