import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

import {
  NgxQrcodeElementTypes,
  NgxQrcodeErrorCorrectionLevels,
} from '@techiediaries/ngx-qrcode';
import { LoadingController, ModalController } from '@ionic/angular';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { element } from 'protractor';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userName: string;
  imageAvatarDefault: string = 'assets/img/default-avatar.png';
  isOpen: boolean = false;
  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';
  level: boolean;
  bolsa: boolean;
  campos: boolean;
  posts: boolean = true;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value: string;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private loadingSvc: LoadingService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    // this.loadingSvc.presentLoading();
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
      this.value = `${this.profileUrl}/${res.id}`;
      // this.loadingSvc.dismissLoading();
      loading.dismiss();
    });
  }

  shareQR() {
    if (this.value) {
      navigator.share({
        title: 'Mi Perfil Golfer',
        text: 'Check my profile golfer',
        url: this.value,
      });
    }
    // if (navigator.share) {
    //   navigator
    //     .share({
    //       title: 'Mi Perfil Golfer',
    //       text: 'Check my profile golfer',
    //       url: this.value,
    //     })
    //     .then(() => console.log('Successful share'))
    //     .catch((error) => console.log('Error sharing', error));
    // }
  }

  async openModal() {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: QrModalComponent,
      backdropDismiss: true,
      cssClass: 'options_modal',
      componentProps: {
        qr: this.value,
      },
    });

    await modal.present();
  }

  selectPage(event: Event) {
    const element = event.target as HTMLElement;
    const value = element.id;
    if (value === '1') {
      this.level = true;
      this.bolsa = false;
      this.campos = false;
      this.posts = false;
      console.log(value);
      return;
    }
    if (value === '2') {
      this.level = false;
      this.bolsa = true;
      this.campos = false;
      this.posts = false;
      console.log(value);
      return;
    }
    if (value === '3') {
      this.level = false;
      this.bolsa = false;
      this.campos = true;
      this.posts = false;
      console.log(value);
      return;
    }
    if (value === '4') {
      this.level = false;
      this.bolsa = false;
      this.campos = false;
      this.posts = true;
      console.log(value);
      return;
    }
  }

  async startScan() {
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result

    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
    }
  }

  async checkPermission() {
    // check or request permission
    const status = await BarcodeScanner.checkPermission({ force: true });

    if (status.granted) {
      // the user granted permission
      return true;
    }

    return false;
  }
}