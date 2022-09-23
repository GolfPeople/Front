import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminRequestPageRoutingModule } from './admin-request-routing.module';

import { AdminRequestPage } from './admin-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminRequestPageRoutingModule
  ],
  declarations: [AdminRequestPage]
})
export class AdminRequestPageModule {}
