import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DescriptionPageRoutingModule } from './description-routing.module';

import { DescriptionPage } from './description.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { CropperComponent } from './components/cropper/cropper.component';
import { SwiperModule } from 'swiper/angular';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DescriptionPageRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    SwiperModule,
    ImageCropperModule,
  ],
  declarations: [DescriptionPage, CropperComponent],
})
export class DescriptionPageModule {}
