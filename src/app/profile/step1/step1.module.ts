import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Step1PageRoutingModule } from './step1-routing.module';

import { Step1Page } from './step1.page';
import { CropperComponent } from './components/cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  entryComponents: [CropperComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    Step1PageRoutingModule,
    ImageCropperModule,
  ],
  declarations: [Step1Page, CropperComponent],
})
export class Step1PageModule {}
