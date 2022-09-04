import { Location } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  AfterContentChecked,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import {
  PostsResponse,
  UserPublicData,
} from 'src/app/core/interfaces/interfaces';
import { Friend } from 'src/app/core/models/friend.interface';
import { UserService } from 'src/app/core/services/user.service';

import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Lazy, Navigation } from 'swiper';
import { PostsService } from 'src/app/core/services/posts.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProfilePage implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  // Posts
  posts: PostsResponse[] = [];
  page = 1;
  isLoadingMore: boolean = false;
  isMyProfile: boolean = false;

  profileUrl: string = 'https://golf-people.web.app/tabs/user-profile';
  value: string;

  // Swiper pages
  levelTab: boolean = false;
  postsTab: boolean = true;

  // Validación de seguidor
  following: boolean = false;
  isPrivate: boolean = false;
  sentFriendRequest: boolean = false;
  myId;

  id;
  userInfo = {
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
    friends: null,
  };

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private userSvc: UserService,
    private location: Location,
    private friendsSvc: FriendsService,
    private postsSvc: PostsService,
    private modalCtrl: ModalController
  ) {
    this.myId = localStorage.getItem('user_id');
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
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

        if (this.userInfo.id == this.myId) {
          this.isMyProfile = true;
          // loading.dismiss();
          // return;
        }

        if (this.userInfo.friends.length) {
  
          this.userInfo.friends.forEach((friendsItem) => {
            if (friendsItem.connect.length) {
       
              const friend = friendsItem;
              // console.log(friend)
              friendsItem.connect.forEach((connectItem) => {
           
                // console.log('connect item test -->', connectItem)

                if (connectItem.user_id == this.myId) {
       
                  // if (friend.connections) {
                  if (friend.connections.status === 1) {
                    this.sentFriendRequest = true;
                  
                  } else if (friend.connections.status === 2) {
                    this.following = true;
                 
                  } else {
                    this.following = false;
                  }
                  // } else {
                  //   this.following = false;
                  // }
                }
              });
            }

            // if (item.connect.connection_id === 1) {
            //     this.following = true;
            //   console.log('Eres amigo');
            // }

            // if (item.user_id == this.myId) {
            //   this.following = true;
            //   console.log('Eres amigo');
            // }
          });
        }

        if (this.userInfo.privacity.profile === 1) {
          this.isPrivate = true;
        }
        this.value = `${this.profileUrl}/${this.id}`;

        this.postsSvc.getPostsByUser(this.id, this.page).subscribe(
          ({ data }) => {
            this.posts = data.filter((item) => item.files.length);
            console.log(this.posts);
            this.page += 1;
            loading.dismiss();
          },
          (error) => {
            loading.dismiss();
          }
        );
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

  friendRequest() {
    this.sentFriendRequest = true;
    this.friendsSvc.friendRequest(this.id).subscribe((res) => {

    });
  }

  follow() {
    this.following = true;

    this.friendsSvc.follow(this.id).subscribe((res) => console.log(res));
  }

  unfollow() {
    this.following = false;

    this.friendsSvc.unfollow(this.id).subscribe((res) => console.log(res));
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

  next() {
    this.swiper.swiperRef.slideNext(500);
    this.postsTab = false;
    this.levelTab = true;
  }
  prev() {
    this.swiper.swiperRef.slidePrev(500);
    this.postsTab = true;
    this.levelTab = false;
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.postsSvc.getPostsByUser(this.id, this.page).subscribe(
      ({ data }) => {
        this.posts = this.posts.concat(
          data.filter((item) => item.files.length)
        );
        this.isLoadingMore = false;
        if (data.length) {
          this.page += 1;
        }
      },
      (error) => {
        this.isLoadingMore = false;
        console.log(error);
      }
    );
  }
}
