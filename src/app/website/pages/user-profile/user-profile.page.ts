import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentChecked,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { UserPublicData } from 'src/app/core/interfaces/interfaces';
import { Friend } from 'src/app/core/models/friend.interface';
import { UserService } from 'src/app/core/services/user.service';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Lazy, Navigation } from 'swiper';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfilePage implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  profileUrl: string = 'https://golf-people.web.app/website/user-profile';
  value: string;

  level: boolean = true;
  posts: boolean = false;

  id;
  userInfo: Friend = {
    id: null,
    name: null,
    email: null,
    email_verified_at: null,
    created_at: null,
    updated_at: null,
    provider: null,
    provider_id: null,
    profile: { photo: '' },
    privacity: null,
    to: null,
    from: null,
  };

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private userSvc: UserService,
    private location: Location
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();

    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.id = param.get('id');

          if (this.id) {
            return this.userSvc.getUser(this.id);
          }
          return null;
        })
      )
      .subscribe((res) => {
        this.userInfo = res;
        this.value = `${this.profileUrl}/${this.id}`;
        loading.dismiss();
      });
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  goBack() {
    this.location.back();
  }

  favorite() {}

  async shareProfile() {
    if (this.value) {
      await navigator.share({
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

  next() {
    this.swiper.swiperRef.slideNext(500);
    this.posts = true;
    this.level = false;
    console.log(this.posts, this.level);
  }
  prev() {
    this.swiper.swiperRef.slidePrev(500);
    this.posts = false;
    this.level = true;
    console.log(this.posts, this.level);
  }
}
