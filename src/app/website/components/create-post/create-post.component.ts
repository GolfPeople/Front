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
  CameraResultType,
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
import { DomSanitizer } from '@angular/platform-browser';

declare var google: any;
declare var window: any;

const URL = `${environment.golfpeopleAPI}/api`;

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
  // google maps
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
  backgroundImages = [];

  // Simon Grimm method
  selectedFiles: FileList;
  blobArrayData = [];

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
    private platform: Platform,
    private domSanitizer: DomSanitizer
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

  async onSubmit(description, files, ubication) {
    console.log('files -->', files);
    if (!this.platform.is('hybrid')) {
      const loading = await this.loadingCtrl.create({
        cssClass: 'laoding-ctrl',
        spinner: 'crescent',
      });
      await loading.present();

      await this.postsSvc.createPostWithImageFile(
        description,
        files,
        ubication
      );
      loading.dismiss();
    }

    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc.createPost(description, files, ubication);
    loading.dismiss();

    this.openModal('Su publicación ha sido creada exitosamente');
    this.closeModal();
  }

  // Simon Grimm method

  uploadFile(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList = target.files;
    this.selectedFiles = files;
    console.log('selected files -->', this.selectedFiles);

    for (let index = 0; index < files.length; index++) {
      this.blobArrayData.push(files[index]);
      console.log('Archivos seleccionados desde en input', this.blobArrayData);
    }
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
      {
        text: 'Escoger multiples fotos',
        icon: 'image',
        handler: () => {
          this.pickImages();
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

  async addImage(source: CameraSource) {
    // this.blobArrayData = [];
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source,
    });
    console.log('image', image);
    const blobData = this.b64toBlob(
      image.base64String,
      `image/${image.format}`
    );
    const base64Image = this.domSanitizer.bypassSecurityTrustUrl(
      `data:image/${image.format};base64,${image.base64String}`
    );
    console.log(base64Image);
    this.backgroundImages.push(base64Image);
    this.convertBlobToBase64(blobData).then((res) =>
      console.log('TEST base64', res as string)
    );
    console.log('Blob a enviar 2', blobData);
    // this.backgroundImages.push(image);
    this.blobArrayData.push(blobData);
  }

  b64toBlob(base64, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
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