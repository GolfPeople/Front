import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CompleteProfilePage } from './complete-profile.page';

import { CompleteProfilePageRoutingModule } from './complete-profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteProfilePageRoutingModule,
  ],
  declarations: [CompleteProfilePage],
})
export class CompleteProfilePageModule {}
