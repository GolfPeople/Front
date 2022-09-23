import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuccessRequestPageRoutingModule } from './success-request-routing.module';

import { SuccessRequestPage } from './success-request.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuccessRequestPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SuccessRequestPage]
})
export class SuccessRequestPageModule {}
