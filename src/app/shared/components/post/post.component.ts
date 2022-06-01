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
import SwiperCore, { Pagination, Lazy } from 'swiper';

import { PostsService } from '../../../core/services/posts.service';
import { switchMap } from 'rxjs/operators';
import { ReactionsService } from 'src/app/core/services/reactions.service';
import { Like, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { EditPostComponent } from 'src/app/website/components/edit-post/edit-post.component';
import { LikesComponent } from '../likes/likes.component';
import { CommentsComponent } from '../comments/comments.component';

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
  userPhoto: string = '';

  @Input() userName: string;
  // @Input() userId;
  @Input() likes: Like[];
  userID;
  count: number = 0;

  liked: boolean = false;
  saved: boolean = false;

  taggedFriends: string[] = [];
  taggedFriendsId: string[] = [];
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
    private reactionsSvc: ReactionsService
  ) {
    this.userID = localStorage.getItem('user_id');
    this.userSvc.userPhoto$.subscribe((photo) => {
      if (photo) this.userPhoto = photo;
    });
  }

  async ngOnInit() {
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
    if (this.post.friends_name) {
      this.taggedFriends = JSON.parse(this.post.friends_name).split(',');
      console.log(this.taggedFriends);
    }
    if (this.post.friends_id) {
      this.taggedFriendsId = JSON.parse(this.post.friends_id).split(',');
      console.log(this.taggedFriendsId);
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

  onClick() {
    this.presentActionSheet();
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
                    handler: () => {
                      this.postsSvc.deletePost(this.post.id);
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
      url: `https://golf-people.web.app/website/post/${this.post.user.name}/${this.post.id}'`,
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
