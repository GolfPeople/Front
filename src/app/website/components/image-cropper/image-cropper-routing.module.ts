import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImageCropperPage } from './image-cropper.page';

const routes: Routes = [
  {
    path: '',
    component: ImageCropperPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageCropperPageRoutingModule {}
