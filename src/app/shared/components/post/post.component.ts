import {
  Component,
  OnInit,
  Input,
  AfterContentChecked,
  ViewChild,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Lazy } from 'swiper';

import { PostsService } from '../../../core/services/posts.service';
import { switchMap } from 'rxjs/operators';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { Like, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { EditPostComponent } from 'src/app/pages/tabs/components/edit-post/edit-post.component';
import { LikesComponent } from '../likes/likes.component';
import { CommentsComponent } from '../comments/comments.component';
import { threadId } from 'worker_threads';

SwiperCore.use([Lazy, Pagination]);

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;

  @Input() post: PostsResponse;
  description: string = '';
  hashtags: string[];
  address: string = '';
  avatarDefault = 'assets/img/default-avatar.png';

  userPhoto: string = '';

  @Input() userName: string;
  @Input() likes: Like[];
  @Output() delete = new EventEmitter();
  userID;
  count: number = 0;

  liked: boolean = false;
  saved: boolean = false;

  taggedFriends = [];
  taggedFriendsId = [];
  tagged: any = [];

  swiperConfig: SwiperOptions = {
    pagination: { clickable: true },
    lazy: { loadPrevNext: true },
  };

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private postsSvc: PostsService,
    private userSvc: UserService,
    private reactionsSvc: ReactionsService,
    private loadingCtrl: LoadingController
  ) {
    this.userID = localStorage.getItem('user_id');
    this.userSvc.userPhoto$.subscribe((photo) => {
      if (photo) this.userPhoto = photo;
    });
  }

  async ngOnInit() {
    this.hashtags = JSON.parse(this.post.hashtags);
    if (this.post.likes.length > 0) {
      this.count = this.post.likes.length;
      this.post.likes.forEach((item) => {
        if (item.user_id == this.userID) {
          this.liked = true;
        }
      });
    }
    if (this.post.favorites.length) {
      this.post.favorites.forEach((item) => {
        if (item.user_id == this.userID) {
          this.saved = true;
        }
      });
    }
    this.getTags();
  }

  onClick() {
    this.presentActionSheet();
  }

  getTags() {
    if (this.post.friends_name) {
      const frindsString = JSON.parse(this.post.friends_name);
      frindsString ? (this.taggedFriends = frindsString.split(',')) : null;
    }
    if (this.post.friends_id) {
      const frindsString = JSON.parse(this.post.friends_id);
      frindsString ? (this.taggedFriendsId = frindsString.split(',')) : null;
    }

    for (let i = 0; i < this.taggedFriends.length; i++) {
      const name = this.taggedFriends[i];
      const id = this.taggedFriendsId[i];
      const obj = {
        name,
        id,
      };
      this.tagged.push(obj);
    }
  }

  async presentActionSheet() {
    if (this.userID == this.post.user_id) {
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
                mode: 'md',
                cssClass: 'delete-confirmation',
                message: '¿Estás seguro de eliminar esta publicación?',
                buttons: [
                  {
                    text: 'aceptar',
                    handler: async () => {
                      const loading = await this.loadingCtrl.create({
                        cssClass: 'loading-ctrl',
                      });
                      await loading.present();
                      this.postsSvc
                        .deletePost(this.post.id)
                        .subscribe((res) => {
                          console.log('Delete --> ', res);
                          this.delete.emit();
                          loading.dismiss();
                        });
                    },
                  },
                  {
                    text: 'cancelar',
                    role: 'cancel',
                  },
                ],
              });
              await alert.present();
            },
          },
          {
            text: 'Compartir',
            icon: 'share',
            data: 10,
            handler: () => this.sharePost(),
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
                  post: this.post,
                },
              });

              modal.onDidDismiss().then(async ({ data }) => {
                this.description = data.description;
                this.hashtags = data.hashtags;
                // this.taggedFriends = data.taggedFriends;
                // this.taggedFriendsId = data.taggedFriendsId;
                if (data.taggedFriends.length) {
                  this.tagged = [];
                  for (let i = 0; i < data.taggedFriends.length; i++) {
                    const name = data.taggedFriends[i];
                    const id = data.taggedFriendsId[i];
                    const obj = {
                      name,
                      id,
                    };
                    this.tagged.push(obj);
                  }
                } else {
                  this.tagged = [];
                }

                this.address = data.userAddress;
                console.log('Data TEST -->', data);
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
            handler: () => this.sharePost(),
          },
          {
            text: 'Reportar abuso',
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

  sharePost() {
    navigator.share({
      title: 'Publicación',
      text: 'Mira esta publicación',
      url: `https://golf-people.web.app/tabs/post/${this.post.user.name}/${this.post.id}'`,
    });
  }

  async showLikes() {
    const usersLiked = this.post.likes.map((item) => item.user.name);
    console.log(usersLiked, this.post.likes);
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
    this.liked = !this.liked;
    this.liked === true
      ? (this.count = this.count + 1)
      : (this.count = this.count - 1);
    this.reactionsSvc.like(this.post.id).subscribe((res: any) => {
      this.count = res.count;
      console.log(res);
    });
  }

  savePost() {
    this.saved = !this.saved;
    this.postsSvc.savePost(this.post.id).subscribe((res) => console.log(res));
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: CommentsComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        post: this.post,
      },
    });
    return await modal.present();
  }
}
