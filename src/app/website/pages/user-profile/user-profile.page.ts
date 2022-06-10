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

  profileUrl: string = 'https://golf-people.web.app/website/user-profile';
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
    friends: null,
  };

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private userSvc: UserService,
    private location: Location,
    private friendsSvc: FriendsService,
    private postsSvc: PostsService
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
        console.log(res);
        this.userInfo = res;

        if (this.userInfo.friends.length) {
          console.log('Frends test -->')
          this.userInfo.friends.forEach((friendsItem) => {
            if (friendsItem.connect.length) {
              console.log('Connect test -->')
              const friend = friendsItem
              // console.log(friend)
              friendsItem.connect.forEach(connectItem => {
                console.log('Connect forEach test -->')
                // console.log('connect item test -->', connectItem)
                
                if (connectItem.user_id == this.myId) {
                  console.log('tienes conexion')
                  if (friend.connections.status === 1) {
                    this.sentFriendRequest = true;
                    console.log('Ya has enviado una solicitud e amistad.')
                  } else if(friend.connections.status === 2) {
                      this.following = true
                      console.log('Solicitud de amistad aprobada')
                  } else {
                    this.following = false
                  }
                }
              })
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
      console.log('Solicitud enviada -->', res);
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
