import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AlertController,
  IonSearchbar,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { Camera, GalleryImageOptions, Photo } from '@capacitor/camera';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SuccessComponent } from '../success/success.component';
import { SwiperComponent } from 'swiper/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';

declare var google: any;
declare var window: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CreatePostComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('searchbar', { read: IonSearchbar }) searchbar: IonSearchbar;

  autocomplete: any;
  geocoder = new google.maps.Geocoder();
  coords;

  latitud: any;
  longitude: any;

  textArea: FormControl;
  address: FormControl;
  filesToSend;

  tempImages = [];

  private apiUrl = `${environment.golfpeopleAPI}/api`;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    // private camera: Camera,
    private loader: LoadingController,
    private fb: FormBuilder,
    private geolocationService: GeolocationService
  ) {
    // this.initAutoComplete();
  }

  ngAfterViewInit(): void {
    this.initAutoComplete();
  }
  async ngOnInit() {
    const { description, location } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };
    this.geoCodeLatLong(this.coords);
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  initFormControls() {
    const description = new FormControl('', {});
    const location = new FormControl('', {});

    return { description, location };
  }

  onSubmit(description, ubication, files) {
    return this.http
      .post(`${this.apiUrl}/publish`, { description, ubication, files })
      .subscribe((res) => {
        console.log('RESpuesta,', res);
        this.openModal();
        this.closeModal();
      });
    // this.openModal();
  }

  initAutoComplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('input-post') as HTMLInputElement,
      {
        types: ['establishment'],
        componentRestrictions: { country: ['ES'] },
        fields: ['place_id', 'geometry', 'name'],
      }
    );

    // this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  }

  geoCodeLatLong(latlng) {
    // This is making the Geocode request
    const address = this.address;
    console.log('TEST LAt Long', latlng);
    this.geocoder.geocode({ location: latlng }, function (results, status) {
      console.log('TEST results', results);
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        // var address = results[0].formatted_address;

        //This is placing the returned address in the 'Address' field on the HTML form

        address.setValue(
          `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`
        );
        console.log(address.value);
      }
    });
    this.address.setValue(address.value);
  }

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
          // this.tempImages = [...images];

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
        });
        ele.dismiss();
      });
  }
}
