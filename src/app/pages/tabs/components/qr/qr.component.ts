import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss'],
})
export class QrComponent implements OnInit {
  @Input() qr;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value;

  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.value = `${this.profileUrl}/${res.id}`;
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
