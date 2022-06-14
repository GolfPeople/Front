import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateFieldPageRoutingModule } from './create-field-routing.module';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { CreateFieldPage } from './create-field.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CropperComponent } from './components/cropper/cropper.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

@NgModule({
  entryComponents: [CropperComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateFieldPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    GooglePlaceModule,
  ],
  declarations: [CreateFieldPage, CropperComponent, SuccessModalComponent],
})
export class CreateFieldPageModule {}
