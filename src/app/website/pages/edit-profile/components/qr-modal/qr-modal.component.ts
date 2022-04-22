import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {
  @Input() qr;

  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value;

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.value = `${this.profileUrl}/${res.id}`;
    });
    console.log(this.qr);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
