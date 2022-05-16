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
// import { SuccessComponent } from '../success/success.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { SwiperComponent } from 'swiper/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { Post } from 'src/app/core/interfaces/interfaces';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { CropperComponent } from './components/cropper/cropper.component';
import SwiperCore, { Pagination, Lazy } from 'swiper';

declare var google: any;
declare var window: any;

SwiperCore.use([Lazy, Pagination]);

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('fileInputVideo', { static: false }) fileInputVideo: ElementRef;
  // @Input() type: number;
  @Input() postId: number;

  // google maps
  autocomplete: any;
  geocoder = new google.maps.Geocoder();
  coords;

  latitud: any;
  longitude: any;

  //ngx autocomplete
  title = 'google-places-autocomplete';
  userAddress: string = '';
  userLatitude: string = '';
  userLongitude: string = '';

  textArea: FormControl;
  address: FormControl;
  filesToSend;

  //Crop image
  imageDAtaUrl: any;
  croppedImage: any;

  postImages = [];
  editPost: boolean = false;
  backgroundImages = [];
  backgroundImagesEdit = [];

  // Simon Grimm method
  selectedFiles: FileList;
  blobArrayData: Blob[] = [];

  //hashtags
  hashtagsInput: FormControl;
  inputValue: string;
  inputHashtagsValue = [];
  hashtags = [];
  hashtagsString: string;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private http: HttpClient,
    // private camera: Camera,
    private loader: LoadingController,
    private geolocationService: GeolocationService,
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,

    private _location: Location
  ) {}

  ngAfterViewInit(): void {
    // this.initAutoCom();
  }
  async ngOnInit() {
    const { description, location, hashtags } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    this.hashtagsInput = hashtags;
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  initFormControls() {
    const description = new FormControl('', {});
    const location = new FormControl(this.userAddress, {});
    const hashtags = new FormControl('', {});
    return { description, location, hashtags };
  }

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
  }

  hashtag(event: Event) {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.inputValue = value;
  }

  addHashtags() {
    this.hashtagsInput.reset();
    console.log(this.inputValue);
    const data = [...this.hashtags, ...this.inputValue.split(' ')];
    console.log(data);
    this.hashtags = data.filter((item, index) => {
      return data.indexOf(item) === index;
    });
    this.hashtagsString = this.hashtags
      .join(' ')
      .split(' ')
      .map((item) => {
        if (item.includes('#')) {
          return item;
        }

        return `#${item}`;
      })
      .join(' ');
    console.log(this.hashtags);
    console.log(this.hashtagsString);
  }

  removeHashtag(hashtag: string) {
    // if (this.type === 2) {
    //   const newHashtags = this.postHashtags.filter((item) => item !== hashtag);
    //   this.postHashtags = [...newHashtags];
    //   console.log(hashtag, newHashtags, this.postHashtags);
    //   return;
    // }
    const newHashtags = this.hashtags.filter((item) => item !== hashtag);
    this.hashtags = [...newHashtags];
  }

  removeImage(index) {
    console.log('index -->', index);
    this.backgroundImages.splice(index, 1);
    this.blobArrayData.splice(index, 1);

    console.log(this.backgroundImages.length, this.blobArrayData.length);
  }

  // Simon Grimm method

  async uploadFile(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList = target.files;
    this.selectedFiles = files;
    console.log('selected files -->', this.selectedFiles);
    const filesTobase64 = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const base64 = await this.getBase64(file).then();
      filesTobase64.push(base64);
    }

    for (let index = 0; index < filesTobase64.length; index++) {
      const fileBase64 = filesTobase64[index];

      // const base64Image = this.domSanitizer.bypassSecurityTrustUrl(
      //   `data:${file.type};base64,${base64}`
      // );
      console.log('base64Image', fileBase64);
      this.backgroundImages.push(fileBase64);
    }

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
    ];

    if (!this.platform.is('hybrid')) {
      buttons.push({
        text: 'Escoger archivo',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
      buttons.push({
        text: 'Subir video',
        icon: 'attach',
        handler: () => {
          this.fileInputVideo.nativeElement.click();
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
    const image = await Camera.getPhoto({
      quality: 30,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source,
    });
    const imageDataUrl = await image.dataUrl;
    this.imageDAtaUrl = await imageDataUrl;

    const croppperModal = await this.modalCtrl.create({
      component: CropperComponent,
      componentProps: {
        imageBase64: imageDataUrl,
      },
    });
    croppperModal.onDidDismiss().then((data) => {
      this.croppedImage = data.data;
      this.backgroundImages.push(this.croppedImage);
      console.log(this.backgroundImages);
      const blobData = this.b64toBlob(
        this.croppedImage,
        `image/${image.format}`
      );
      this.blobArrayData.push(blobData);
    });
    await croppperModal.present();
  }

  async presentCropper(imageBase64) {
    const modal = await this.modalCtrl.create({
      component: CropperComponent,
      componentProps: {
        imageBase64,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.croppedImage = data.data;
      console.log('image cropped', this.croppedImage);
    });
    return await modal.present();
  }

  b64toBlob(base64, contentType = '', sliceSize = 512) {
    const base64String = base64.replace('data:image/png;base64,', '');
    const byteCharacters = atob(base64String);
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

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  // initAutoCom() {
  //   this.autocomplete = new google.maps.places.Autocomplete(
  //     document.getElementById('location') as HTMLInputElement,
  //     {
  //       fields: ['place_id', 'geometry', 'name'],
  //     }
  //   );

  //   // this.autocomplete.addListener('place_changed', this.onPlaceChanged);
  // }

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
      component: SuccessModalComponent,
      backdropDismiss: false,
      cssClass: 'request-modal',
      componentProps: {
        message,
        route: '/website/profile',
      },
    });

    await modal.present();
  }

  goBack() {
    // this.router.navigate(['..']);
    this._location.back();
  }

  async onSubmit(description, files, ubication) {
    let descriptionConcat;
    this.hashtagsString === undefined
      ? (descriptionConcat = description)
      : (descriptionConcat = description.concat(` ${this.hashtagsString}`));

    console.log('description -->', descriptionConcat);

    if (!this.platform.is('hybrid')) {
      const loading = await this.loadingCtrl.create({
        cssClass: 'laoding-ctrl',
        spinner: 'crescent',
      });
      await loading.present();
      await this.postsSvc
        .createPostWithImageFile(descriptionConcat, files, this.userAddress)
        .subscribe((res) => {
          console.log(res);
          loading.dismiss();
          // this.postsSvc.getPosts();
          // this.postsSvc.getPostsAction();
          this.openModal('Su publicación ha sido creada exitosamente');
        });
      // this.closeModal();
      // await this.postsSvc.createPostWithImageFile(
      //   descriptionConcat,
      //   files,
      //   this.userAddress
      // );
      // await loading.dismiss();
      // this.openModal('Su publicación ha sido creada exitosamente');
      // // this.closeModal();
      return;
    }

    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc.createPost(descriptionConcat, files, ubication);
    loading.dismiss();

    this.openModal('Su publicación ha sido creada exitosamente').then((res) => {
      console.log(res);
    });
    console.log('se cerró');
    // this.closeModal();
  }
}
