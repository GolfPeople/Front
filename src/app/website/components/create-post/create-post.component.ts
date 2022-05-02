import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Camera, GalleryImageOptions, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

// import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

// import {
//   Camera,
//   CameraResultType,
//   CameraSource,
//   Photo,
// } from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesService } from 'src/app/core/services/files.service';
import { LoginService } from 'src/app/core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SuccessComponent } from '../success/success.component';

declare var google: any;
declare var window: any;

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})
export class CreatePostComponent implements OnInit, AfterViewInit {
  autocomplete;

  latitud: any;
  longitude: any;

  textArea;
  address;
  filesToSend;

  tempImages = [];

  private apiUrl = `${environment.golfpeopleAPI}/api`;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    // private camera: Camera,
    private loader: LoadingController
  ) {
    this.initAutoComplete();
  }

  ngOnInit() {
    // this.initAutoComplete();
  }

  onSubmit(description, chareacters, files) {
    return this.http
      .post(`${this.apiUrl}/publish`, { description, chareacters, files })
      .subscribe((res) => {
        console.log('RESpuesta,', res);
        this.openModal();
        this.closeModal();
      });
    // this.openModal();
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: SuccessComponent,
      backdropDismiss: true,
      cssClass: 'request-modal',
      componentProps: {
        message: 'Su publicación ha sido creada exitosamente',
      },
    });

    await modal.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  // photo() {
  //   const options: CameraOptions = {
  //     quality: 60,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     encodingType: this.camera.EncodingType.JPEG,
  //     mediaType: this.camera.MediaType.PICTURE,
  //     correctOrientation: true,
  //     sourceType: this.camera.PictureSourceType.CAMERA,
  //   };

  //   this.camera.getPicture(options).then(
  //     (imageData) => {
  //       // imageData is either a base64 encoded string or a file URI
  //       // If it's base64 (DATA_URL):

  //       const img = window.Ionic.WebView.convertFileSrc(imageData);
  //       console.log(imageData);

  //       this.tempImages.push(img);

  //       //  let base64Image = 'data:image/jpeg;base64,' + imageData;
  //     },
  //     (err) => {
  //       // Handle error
  //     }
  //   );
  // }

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
        Camera.pickImages(options).then((val) => {
          console.log('val pick images-->', val);
          const images = val.photos;
          this.tempImages = [];
          console.log(images);
          this.tempImages = val.photos.map((img) => img.webPath);

          // console.log('IMAGES', this.images);
          // for (let i = 0; 1 < images.length; i++) {
          //   this.imgs.push(images[i].webPath);
          // }
          // for (let image of images) {
          //   // console.log('TEST pictures');
          //   this.readAsBase64(image.webPath).then((res) => {
          //     console.log('RES-->', res);
          //     this.imgs.push(res);
          //   });
          //   // this.imgs.push(image.webPath);
          // }
          console.log(this.tempImages);
          ele.dismiss();
        });
      });
  }
}
