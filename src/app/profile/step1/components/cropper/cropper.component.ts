import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss'],
})
export class CropperComponent implements OnInit {
  @Input() imageBase64: string;
  croppedImage = null;
  imageChangedEvent: any;
  constructor(private modalCtrl: ModalController) {}

  ngAfterViewInit(): void {}

  ngOnInit() {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event) {
    this.croppedImage = event.base64;
  }

  dismissModal() {
    this.modalCtrl.dismiss(this.croppedImage);
  }
}
