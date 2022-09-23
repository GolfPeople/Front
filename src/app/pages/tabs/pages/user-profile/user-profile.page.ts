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
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as firebase from 'firebase/compat/app';
import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { CampusDataService } from '../campus/services/campus-data.service';

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

  segment = 'posts'

  // Swiper pages
  levelTab: boolean = false;
  postsTab: boolean = true;
  campusTab: boolean = false;
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

  loadingChats: boolean;


  toggleOptions = { one: 'Campos Jugados', two: 'Clubes Asociados' }
  toggle$ = new BehaviorSubject(false);

  courses = new BehaviorSubject([]);

  constructor(
    private actRoute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private userSvc: UserService,
    private location: Location,
    private friendsSvc: FriendsService,
    private postsSvc: PostsService,
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService,
    public chatSvc: ChatService,
    public gameSvc: GameService,
    public campusSvg: CampusDataService
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
        console.log(res);
        
        this.getCourses();

        if (this.userInfo.id == this.myId) {
          this.isMyProfile = true;

        }

        if (this.userInfo.friends.length) {

          this.userInfo.friends.forEach((friendsItem) => {
            if (friendsItem.connect.length) {

              const friend = friendsItem;

              friendsItem.connect.forEach((connectItem) => {

                if (connectItem.user_id == this.myId) {

                  if (friend.connections.status === 1) {
                    this.sentFriendRequest = true;

                  } else if (friend.connections.status === 2) {
                    this.following = true;

                  } else {
                    this.following = false;
                  }

                }
              });
            }

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

  ionViewWillEnter() {
    this.getChatRooms();
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



  /**===================Mostrar Campos Jugados============== */

  getCourses() {
    
    this.campusSvg.getPlayerCourses(this.userInfo.id).subscribe(res => {
      this.courses.next(res);
   
    }, err => {
      console.log(err);

    })
  }





  /**===================Dejar de seguir============== */
  async confirmUnfollow(user) {

    // obtener el connection_id del usuario
    // user.friends.map(u => {
    //   u.connect.map(c => {
    //     if(c.user_id == this.user_id){
    //      user.connection_id = c.connection_id
    //     }
    //   })
    // })

    // const modal = await this.modalCtrl.create({
    //   component: AlertConfirmComponent,
    //   cssClass: 'alert-confirm',
    //   componentProps: {
    //     confirmText: 'Dejar de seguir',
    //     content: `¿Quieres dejar de seguir a ${(user.name)}?`
    //   }
    // });

    // modal.present();

    // const { data } = await modal.onWillDismiss();
    // if (data) {
    //   this.Unfollow(user)
    // }
  }

  async Unfollow(user) {

    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.friendsSvc.declineRequest(user.connection_id).subscribe(res => {
      this.ionViewWillEnter();
      this.firebaseSvc.Toast(`Haz dejado de seguir a ${(user.name)}`)
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo')
      loading.dismiss();
    })
  }


  favorite() { }

  async shareProfile() {
    if (this.value) {
      await navigator.share({
        title: 'Mi Perfil Golfer',
        text: 'Check my profile golfer',
        url: this.value,
      });
    }
  }

  async openModal() {
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

  async createSingleRoom() {
    let data = {
      message: 'ㅤ',
      sale_id: null
    }
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.chatSvc.sendMessage(this.userInfo.id, data).subscribe((res: any) => {

      let message = {
        chatId: res.sala_id,
        user_id: JSON.parse(localStorage.getItem('user_id')),
        created_at: firebase.default.firestore.FieldValue.serverTimestamp(),
        message: 'ㅤ',
        read: true
      }
      this.firebaseSvc.addToCollection('messages', message).then(e => {
        this.firebaseSvc.routerLink('/tabs/chat-room/messages/' + res.sala_id + '/x');
        loading.dismiss();
      }, error => {
        loading.dismiss();
      })
    }, error => {
      loading.dismiss();
      console.log(error);
    })
  }

  getChatRooms() {
    this.loadingChats = true;
    this.chatSvc.getRoom().subscribe((rooms: any) => {
      this.chatSvc.rooms$.next(rooms)
      this.loadingChats = false;
    })
  }
}
