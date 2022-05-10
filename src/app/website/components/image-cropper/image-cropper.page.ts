import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.page.html',
  styleUrls: ['./image-cropper.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperPage implements OnInit, AfterViewInit {
  @Input() imageBase64: string;
  croppedImage = null;
  imageChangedEvent: any;
  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit(): void {
    console.log(this.imageBase64);
  }

  ngOnInit() {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event) {
    this.croppedImage = event.base64;
    console.log(this.croppedImage);
  }

  dismissModal() {
    this.modalCtrl.dismiss(this.croppedImage);
  }
}
