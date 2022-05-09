import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImageCropperPageRoutingModule } from './image-cropper-routing.module';

import { ImageCropperPage } from './image-cropper.page';

import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImageCropperPageRoutingModule,
    ImageCropperModule,
  ],
  declarations: [ImageCropperPage],
})
export class ImageCropperPageModule {}
