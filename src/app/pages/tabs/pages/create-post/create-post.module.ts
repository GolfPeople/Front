import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatePostPageRoutingModule } from './create-post-routing.module';

import { CreatePostPage } from './create-post.page';
import { SwiperModule } from 'swiper/angular';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { CropperComponent } from './components/cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  entryComponents: [SuccessModalComponent, CropperComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatePostPageRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    ImageCropperModule,
    GooglePlaceModule,
  ],
  declarations: [CreatePostPage, SuccessModalComponent, CropperComponent],
})
export class CreatePostPageModule {}
