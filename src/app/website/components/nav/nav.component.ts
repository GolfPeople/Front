import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../core/services/user.service';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  activeMenu: boolean = false;
  userName: string;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
    });
  }

  toggleMenu() {
    this.activeMenu = !this.activeMenu;
  }

  onLogout() {
    this.loginService.logout();
  }

  async openModal() {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
      backdropDismiss: true,
      cssClass: 'create-post-modal',
      componentProps: {},
    });

    await modal.present();
  }
}
