import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController } from '@ionic/angular';
import { UserPublicData } from 'src/app/core/interfaces/interfaces';
import { LoginService } from 'src/app/core/services/login.service';
import { UserService } from 'src/app/core/services/user.service';
import { QrComponent } from './components/qr/qr.component';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  user: UserPublicData;

  userName: string;
  imageAvatarDefault = 'assets/img/default-avatar.png';

  profileImage;
  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';

  value;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private menuCtrl: MenuController
  ) {
    this.userService.user$.subscribe((data) => {
      this.user = data;
      this.value = `${this.profileUrl}/${data.id}`;
    });
    this.userService.userPhoto$.subscribe((photo) => {
      if (photo) this.profileImage = photo;
    });
  }

  ngOnInit() {}

  onLogout() {
    this.loginService.logout();
  }



  async openQR() {
    const modal = await this.modalCtrl.create({
      component: QrComponent,
      backdropDismiss: true,
      cssClass: 'options_modal',
      componentProps: {
        qr: this.value,
      },
    });

    await modal.present();
  }

  openMenu() {
    this.menuCtrl.enable(true, 'main-menu')
    this.menuCtrl.open('main-menu')
  }

}
