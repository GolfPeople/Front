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

SwiperCore.use([Pagination]);

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  @Input() userName: string;
  @Input() avatar: string;
  @Input() description: string;
  @Input() location: string;
  @Input() images;
  @Input() id;
  @Input() userId;
  @Input() type;
  @Input() hashtags;
  user;

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
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.userSvc.id$.subscribe((id) => (this.user = id));
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  onClick() {
    this.presentActionSheet();
  }

  async presentActionSheet() {
    // if (this.user == this.userId) {
    console.log(this.user, this.userId);
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
                    await this.postsSvc.deletePost(this.id).subscribe((res) => {
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
              url: `https://golf-people.web.app/post/${this.userName}/${this.id}'`,
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
              component: CreatePostComponent,
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
    // } else {
    //   const actionSheet = await this.actionSheetCtrl.create({
    //     header: 'Publicación',
    //     cssClass: 'my-custom-class',

    //     buttons: [
    //       {
    //         text: 'Compartir',
    //         icon: 'share',
    //         data: 10,
    //         handler: () => {
    //           navigator.share({
    //             title: 'public-post',
    //             text: 'Mira este post',
    //             url: `https://golf-people.web.app/post/${this.userName}/${this.id}'`,
    //           });
    //         },
    //       },
    //       {
    //         text: 'Reportar',
    //         icon: 'pencil',
    //         data: 10,
    //       },

    //       {
    //         text: 'Cancel',
    //         icon: 'close',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         },
    //       },
    //     ],
    //   });
    //   await actionSheet.present();

    //   const { role, data } = await actionSheet.onDidDismiss();
    // }

    // console.log('onDidDismiss resolved with role and data', role, data);
  }
}
