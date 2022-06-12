import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';
import { SaveInfoModalComponent } from '../save-info-modal/save-info-modal.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  handicap: boolean;
  profile: boolean;
  id;

  constructor(
    private personaSvc: PersonalInfoService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => (this.id = res.id));
  }

  async openModal() {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: SaveInfoModalComponent,
      backdropDismiss: true,
      cssClass: 'request-modal',
      componentProps: {},
    });

    await modal.present();
  }

  toggleHandicapPrivacy() {
    if (this.handicap === true) {
      this.handicap = false;
    } else if (this.handicap === false) {
      this.handicap = true;
    } else {
      this.handicap = true;
    }
    console.log(this.handicap);
  }
  toggleProfilePrivacy() {
    if (this.profile === true) {
      this.profile = false;
    } else if (this.profile === false) {
      this.profile = true;
    } else {
      this.profile = true;
    }
    console.log(this.profile);
  }

  async onSubmit(handicap, profile) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl'
    })
    await loading.present()
    this.personaSvc
      .changePrivacy(handicap, profile, this.id)
      .subscribe((res) => {
        loading.dismiss()
        console.log('Privacy res --> ', res)
        this.openModal();
      });
  }
}
