import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenPageRoutingModule } from './resumen-routing.module';

import { ResumenPage } from './resumen.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenPageRoutingModule,
    ComponentsModule
  ],
  declarations: [ResumenPage]
})
export class ResumenPageModule {}
