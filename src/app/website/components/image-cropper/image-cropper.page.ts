import { Component, OnInit, Input } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.page.html',
  styleUrls: ['./image-cropper.page.scss'],
})
export class ImageCropperPage implements OnInit {
  @Input() image: string;
  myImage = null;
  croppedImage = null;
  constructor() {}

  ngOnInit() {
    console.log(this.image);
    this.myImage = this.image;
  }

  imageCropped(e: ImageCroppedEvent) {
    this.croppedImage = e.base64;
  }
}
