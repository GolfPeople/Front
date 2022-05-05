import {
  Component,
  OnInit,
  Input,
  AfterContentChecked,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { CreatePostComponent } from 'src/app/website/components/create-post/create-post.component';
import { SwiperComponent } from 'swiper/angular';

import { PostsService } from '../../../core/services/posts.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent implements OnInit, AfterContentChecked {
  @ViewChild('swiper') swiper: SwiperComponent;

  @Input() userName: string;
  @Input() avatar: string;
  @Input() description: string;
  @Input() location: string;
  @Input() images;
  @Input() id;

  constructor(
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private postsSvc: PostsService,
    private router: Router
  ) {}

  ngOnInit() {}

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  onClick() {
    this.presentActionSheet();
  }

  async presentActionSheet() {
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
                  handler: () => {
                    this.postsSvc.deletePost(this.id);
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
            console.log('Share clicked');
            this.router.navigate([`/website/post/${this.id}`]);
          },
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
    // console.log('onDidDismiss resolved with role and data', role, data);
  }
}
