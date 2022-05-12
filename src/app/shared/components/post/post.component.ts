import {
  Component,
  OnInit,
  Input,
  AfterContentChecked,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { CreatePostComponent } from 'src/app/website/components/create-post/create-post.component';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination } from 'swiper';

import { PostsService } from '../../../core/services/posts.service';
import { switchMap } from 'rxjs/operators';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { Like, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { EditPostComponent } from 'src/app/website/components/edit-post/edit-post.component';
import { LikesComponent } from '../likes/likes.component';

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  @Input() post: PostsResponse;

  @Input() userName: string;
  @Input() avatar: string;
  @Input() description: string;
  @Input() location: string;
  @Input() images;
  @Input() id;
  @Input() userId;
  @Input() type;
  @Input() hashtags;
  @Input() likes: Like[];
  user;
  count;

  liked: boolean = false;

  swiperConfig: SwiperOptions = {
    pagination: { clickable: true },
  };

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private postsSvc: PostsService,
    private router: Router,
    private userSvc: UserService,
    private loadingCtrl: LoadingController,
    private reactionsSvc: ReactionsService
  ) {
    this.userSvc.id$.subscribe((id) => {
      this.user = id;
      // console.log(this.user, id);
    });
  }

  async ngOnInit() {
    // if (this.post.likes.length > 0) {
    //   console.log(this.post.likes);
    //   this.count = this.post.likes.length;
    //   this.post.likes.forEach((item) => {
    //     if (item.user_id === this.user) {
    //       this.liked = true;
    //       // console.log(this.liked);
    //     }
    //   });
    //   console.log(this.liked);
    //   console.log('User ID TEST -->', this.post.user_id, this.user);
    // }
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }

    if (this.post.likes.length > 0) {
      console.log(this.post.likes);
      this.count = this.post.likes.length;
      this.post.likes.forEach((item) => {
        if (item.user_id === this.user) {
          this.liked = true;
          // console.log(this.liked);
        }
      });
      console.log(this.liked);
      console.log('User ID TEST -->', this.post.user_id, this.user);
    }
  }

  onClick() {
    this.presentActionSheet();
  }

  async presentActionSheet() {
    if (this.user == this.post.user_id) {
      console.log(this.user, this.post.user_id);
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Publicación',
        cssClass: 'my-custom-class',

        buttons: [
          {
            text: 'Eliminar',
            role: 'destructive',
            icon: 'trash',
            id: 'delete-button',
            cssClass: 'red',
            data: {
              type: 'delete',
            },
            handler: async () => {
              const alert = await this.alertCtrl.create({
                cssClass: 'alert-confirmation',
                header: 'Eliminar publicación',
                message: 'Estás seguro de eliminar esta publicación',
                buttons: [
                  {
                    text: 'cancelar',
                    role: 'cancel',
                  },
                  {
                    text: 'aceptar',
                    handler: async () => {
                      const loading = await this.loadingCtrl.create({
                        cssClass: 'laoding-ctrl',
                      });
                      await loading.present();
                      await this.postsSvc
                        .deletePost(this.id)
                        .subscribe((res) => {
                          console.log('delete -->', res);
                          this.postsSvc.getPosts();
                        });
                      loading.dismiss();
                    },
                  },
                ],
              });
              await alert.present();
              console.log('Delete clicked');
            },
          },
          {
            text: 'Compartir',
            icon: 'share',
            data: 10,
            handler: () => {
              navigator.share({
                title: 'public-post',
                text: 'Mira este post',
                url: `https://golf-people.web.app/website/post/${this.post.user.name}/${this.post.id}'`,
              });
            },
            // handler: () => {
            //   console.log('Share clicked');
            //   this.router.navigate([`/website/post/${this.userName}/${this.id}`]);
            // },
          },
          {
            text: 'Editar',
            icon: 'pencil',
            data: 10,
            handler: async () => {
              const modal = await this.modalCtrl.create({
                component: EditPostComponent,
                backdropDismiss: true,
                cssClass: 'create-post-modal',
                componentProps: {
                  postId: this.id,
                  type: 2,
                  postDescription: this.description,
                  postFiles: this.images,
                  postLocation: this.location,
                  postHashtags: this.hashtags,
                },
              });

              await modal.present();
              console.log('Share clicked');
            },
          },

          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();

      const { role, data } = await actionSheet.onDidDismiss();
    } else {
      const actionSheet = await this.actionSheetCtrl.create({
        header: 'Publicación',
        cssClass: 'my-custom-class',

        buttons: [
          {
            text: 'Compartir',
            icon: 'share',
            data: 10,
            handler: () => {
              navigator.share({
                title: 'public-post',
                text: 'Mira este post',
                url: `https://golf-people.web.app/post/${this.userName}/${this.id}'`,
              });
            },
          },
          {
            text: 'Reportar',
            icon: 'pencil',
            data: 10,
          },

          {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            },
          },
        ],
      });
      await actionSheet.present();

      const { role, data } = await actionSheet.onDidDismiss();
    }

    // console.log('onDidDismiss resolved with role and data', role, data);
  }
  async showLikes() {
    const usersLiked = this.post.likes.map((item) => item.user.name);
    console.log(usersLiked);
    const modal = await this.modalCtrl.create({
      component: LikesComponent,
      backdropDismiss: true,
      componentProps: {
        userList: usersLiked,
      },
    });

    await modal.present();
    console.log('Share clicked');
  }

  like() {
    // this.liked = !this.liked;
    // this.liked === true
    //   ? (this.count = this.count + 1)
    //   : (this.count = this.count - 1);
    this.liked = true;
    this.count = this.count + 1;
    this.reactionsSvc.like(this.id).subscribe((res: any) => {
      this.count = res.count;
      console.log(res);
    });
  }

  dislike() {
    // this.liked = !this.liked;
    // this.liked === true
    //   ? (this.count = this.count + 1)
    //   : (this.count = this.count - 1);
    this.liked = false;

    this.count = this.count - 1;
    this.reactionsSvc.like(this.id).subscribe((res: any) => {
      this.count = res.count;
      console.log(res);
    });
  }
}
