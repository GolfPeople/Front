import {
  Component,
  OnInit,
  Input,
  AfterContentChecked,
  ViewChild,
} from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { SwiperComponent } from 'swiper/angular';

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

  constructor(private actionSheetCtrl: ActionSheetController) {}

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
          handler: () => {
            console.log('Delete clicked');
          },
        },
        {
          text: 'Compartir',
          icon: 'share',
          data: 10,
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Editar',
          icon: 'pencil',
          data: 10,
          handler: () => {
            console.log('Share clicked');
          },
        },
        {
          text: 'Favorite',
          icon: 'heart',
          handler: () => {
            console.log('Favorite clicked');
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
    console.log('onDidDismiss resolved with role and data', role, data);
  }
}
