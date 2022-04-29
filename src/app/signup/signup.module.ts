import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { SuccessComponent } from '../shared/alerts/success/success.component';
import { ErrorComponent } from '../shared/alerts/error/error.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  entryComponents: [SuccessComponent, ErrorComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
  ],
  declarations: [SignupPage],
})
export class SignupPageModule {}
