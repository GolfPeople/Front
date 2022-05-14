import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { UserProfileData } from 'src/app/core/interfaces/interfaces';
import { QrComponent } from 'src/app/website/components/qr/qr.component';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../core/services/user.service';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  user: UserProfileData;

  userName: string;
  profileImage;
  profileUrl: string = 'https://api.app.golfpeople.com/api/profile';

  value;
  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private router: Router,
    private r: ActivatedRoute
  ) {
    this.userService.user$.subscribe((data) => {
      this.user = data;
      console.log('User info saved', this.user);
      this.value = `${this.profileUrl}/${data.id}`;
    });
    this.userService.userPhoto$.subscribe((photo) => {
      if (photo) this.profileImage = photo;
      console.log(photo);
    });
  }

  ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
      this.value = `${this.profileUrl}/${res.id}`;

      if (res.profile.photo) {
        this.profileImage = res.profile.photo;
      }
    });
  }

  toProfile() {
    this.router.navigate(['profile'], { relativeTo: this.r });
  }

  toHome() {
    this.router.navigate(['/website'], { relativeTo: this.r });
  }

  onLogout() {
    this.loginService.logout();
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePostComponent,
      backdropDismiss: true,
      cssClass: 'create-post-modal',
      componentProps: {},
    });

    await modal.present();
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
}
