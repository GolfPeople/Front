import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Camera, GalleryImageOptions, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';

declare var google: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit, AfterViewInit {
  imgs = [];
  autocomplete;

  latitud: any;
  longitude: any;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private loader: LoadingController,
    private platform: Platform
  ) {
    this.initAutoComplete();
  }

  ngOnInit() {
    // this.initAutoComplete();
  }

  ngAfterViewInit(): void {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('input') as HTMLInputElement,
      {
        types: ['establishment'],
        componentRestrictions: { country: ['ES'] },

        // componentRestrictions: { country: ['AU'] },
        // fields: ['place_id', 'geometry', 'name'],
      }
    );
  }

  initAutoComplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('input') as HTMLInputElement,
      {
        types: ['establishment'],
        componentRestrictions: { country: ['ES'] },
        fields: ['place_id', 'geometry', 'name'],
      }
    );

    // this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  }

  // onPlaceChanged() {

  // }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async pickImages() {
    this.loader
      .create({
        message: 'Cargando',
      })
      .then((ele) => {
        ele.present();
        const options: GalleryImageOptions = {
          correctOrientation: true,
        };
        Camera.pickImages(options).then((value) => {
          const images = value.photos;
          this.imgs = [];

          for (let image of images) {
            console.log('TEST pictures');
            this.readAsBase64(image.webPath).then((res) => {
              console.log('RES-->', res);
              this.imgs.push(res);
            });
            // this.imgs.push(image.webPath);
          }
          console.log(this.imgs);
          ele.dismiss();
        });
      });
  }

  async readAsBase64(photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  async startUpload(file) {
    const response = await fetch(file);
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
  }
}
