import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
  ViewChild,
  ViewEncapsulation,
  Input,
  ElementRef,
} from '@angular/core';
import {
  AlertController,
  IonSearchbar,
  LoadingController,
  ModalController,
  Platform,
  ActionSheetController,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import {
  Camera,
  GalleryImageOptions,
  Photo,
  CameraSource,
} from '@capacitor/camera';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SuccessComponent } from '../success/success.component';
import { SwiperComponent } from 'swiper/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { Post } from 'src/app/core/interfaces/interfaces';

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
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @Input() type: number;
  @Input() postId: number;

  // Post data
  @Input() postDescription: string;
  @Input() postFiles;
  @Input() postLocation: string;

  autocomplete: any;
  geocoder = new google.maps.Geocoder();
  coords;

  latitud: any;
  longitude: any;

  textArea: FormControl;
  address: FormControl;
  filesToSend;

  tempImages = [];

  postImages = [];

  editPost: boolean = false;

  private apiUrl = `${environment.golfpeopleAPI}/api`;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    // private camera: Camera,
    private loader: LoadingController,
    private fb: FormBuilder,
    private geolocationService: GeolocationService,
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform
  ) {
    // this.initAutoComplete();
  }

  ngAfterViewInit(): void {
    this.initAutoCom();
  }
  async ngOnInit() {
    const { description, location } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };
    // this.geoCodeLatLong(this.coords);
    if (this.type === 2) {
      this.editPost = true;
      this.textArea.setValue(this.postDescription);
      this.address.setValue(this.postLocation);
      this.tempImages = this.postFiles;
    }
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
        this.openModal('Su publicación ha sido creada exitosamente');
        this.closeModal();
      });
    // this.openModal();
  }

  uploadFile(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files = target.files;
    console.log('files', files);

    this.postsSvc
      .createPostWithImageFile(this.textArea.value, files, this.address.value)
      .subscribe((res) => {
        console.log('Response -->', res);
      });
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Tomar foto',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: 'Escoger fotos',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
    ];

    if (!this.platform.is('hybrid')) {
      buttons.push({
        text: 'Escoger archivo',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleciona la fuente',
      buttons,
    });
    await actionSheet.present();
  }

  addImage(source: CameraSource) {}

  async edit(description, ubication, files) {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc.editPost(description, ubication, files, this.postId);
    loading.dismiss();

    this.openModal('Su publicación ha sido editada exitosamente');
    this.closeModal();
  }

  initAutoCom() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location') as HTMLInputElement,
      {
        types: ['establishment'],
        componentRestrictions: { country: ['ES'] },
        fields: ['place_id', 'geometry', 'name'],
      }
    );

    // this.autocomplete.addListener('place_changed', this.onPlaceChanged);
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
        Camera.pickImages(options).then((val) => {
          console.log('val pick images-->', val);
          const images = val.photos;
          this.tempImages = [];
          console.log(images);
          this.tempImages = val.photos.map((img) => img);
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

  async openModal(message) {
    const modal = await this.modalCtrl.create({
      component: SuccessComponent,
      backdropDismiss: true,
      cssClass: 'request-modal',
      componentProps: {
        message,
      },
    });

    await modal.present();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
