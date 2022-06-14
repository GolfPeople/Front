import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
  ActionSheetController,
} from '@ionic/angular';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';

import { SuccessModalComponent } from './components/success-modal/success-modal.component';
import { SwiperComponent } from 'swiper/angular';
import { FormControl } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { Location } from '@angular/common';
import { CropperComponent } from './components/cropper/cropper.component';
import SwiperCore, { Pagination, Lazy } from 'swiper';
import { VideoService } from 'src/app/core/services/video.service';
import { CapacitorVideoPlayer } from 'capacitor-video-player';

import { CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { Camera as cmra } from '@awesome-cordova-plugins/camera/ngx';
import { Observable } from 'rxjs';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';
import { finalize, map } from 'rxjs/operators';

declare var google: any;
declare var window: any;

SwiperCore.use([Lazy, Pagination]);

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.page.html',
  styleUrls: ['./create-post.page.scss'],
})
export class CreatePostPage implements OnInit, AfterViewInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('fileInputVideo', { static: false }) fileInputVideo: ElementRef;
  @ViewChild('video') captureElement: ElementRef;
  @ViewChild('address') addressInput: ElementRef;

  imageAvatarDefault = 'assets/img/default-avatar.png';

  // @Input() type: number;

  // google maps
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

  //Capture videos
  mediaRecorder: MediaRecorder;
  videoPlayer: any;
  isRecording = false;
  videos = [];

  backgroundImages = [];

  // Simon Grimm method
  selectedFiles: FileList;
  blobArrayData: Blob[] = [];

  //hashtags
  hashtagsInput: FormControl;
  inputValue: string;
  inputHashtagsValue = [];
  hashtags = [];
  hashtagsString: string = '';

  // tags
  public users$: Observable<Friend[]> | any;

  tagsInput: FormControl;
  tasgsInputValue: string;
  inputTagsValue = [];
  tags = [];
  tagsString: string = '';
  tagsArray = [];
  taggedFriends: string[] = [];
  taggedFriendsId: string[] = [];

  //video

  selectedVideo: string; //= "https://res.cloudinary.com/demo/video/upload/w_640,h_640,c_pad/dog.mp4";
  uploadedVideo: string;

  constructor(
    private modalCtrl: ModalController,
    private videoService: VideoService,
    private geolocationService: GeolocationService,
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private _location: Location,
    private cmra: cmra,
    private friendsSvc: FriendsService
  ) {}

  async ngAfterViewInit() {
    this.videos = await this.videoService.loadVideos();

    // Inicializar el plugin de video
    if (this.platform.is('hybrid')) {
      this.videoPlayer = CapacitorVideoPlayer;
    } else {
      this.videoPlayer = CapacitorVideoPlayer;
    }
  }

  async ngOnInit() {
    var direccion = document.getElementById('address') as HTMLInputElement;
    const { description, location, hashtags, tags } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    this.hashtagsInput = hashtags;
    this.tagsInput = tags;

    console.log('Addres input -->', direccion);
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

  async showLoader() {
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    loading.present();
  }

  dismissLoader() {
    this.loadingCtrl.dismiss();
  }

  async presentAlert(title, message) {
    const alert = await this.alertCtrl.create({
      message: message,
      header: title,
      buttons: ['Dismiss'],
    });
    alert.present();
  }

  cancelSelection() {
    this.selectedVideo = null;
    this.uploadedVideo = null;
  }

  selectVideo() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.cmra.PictureSourceType.PHOTOLIBRARY,
      mediaType: this.cmra.MediaType.VIDEO,
    };

    this.cmra.getPicture(options).then(
      (imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        console.log(imageData);
        let base64Image = 'data:image/jpeg;base64,' + imageData;
      },
      (err) => {
        // Handle error
      }
    );
  }

  initFormControls() {
    const description = new FormControl('', {});
    const location = new FormControl(this.userAddress, {});
    const hashtags = new FormControl('', {});
    const tags = new FormControl('', {});
    return { description, location, hashtags, tags };
  }

  //Método para implementar google autocomplete
  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
  }

  //Capturar el valor del hashtag
  hashtag(event: Event) {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.inputValue = value;
  }

  //Agregar un hashtag  a lista
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

  //Remover un hastag de la lista
  removeHashtag(hashtag: string) {
    const newHashtags = this.hashtags.filter((item) => item !== hashtag);
    this.hashtags = [...newHashtags];

    this.hashtags.length
      ? (this.hashtagsString = this.hashtags
          .join(' ')
          .split(' ')
          .map((item) => {
            if (item.includes('@')) {
              return item;
            }

            return `@${item}`;
          })
          .join(' '))
      : (this.hashtagsString = '');

    console.log(this.hashtagsString);
  }

  tag(value) {
    console.log(value);
    this.tasgsInputValue = value;

    if (value === '') {
      this.users$ = new Observable();

      return;
    }

    if (value) {
      console.log('Valor valido', value);

      this.users$ = this.friendsSvc.search(value).pipe(
        map((data) => data.data),
        finalize(() => {})
      );
    }
    return;
  }

  addTag(tag: string, id: number) {
    this.tagsArray.push({
      name: tag,
      id: id,
    });
    this.taggedFriends.push(tag);
    this.taggedFriendsId.push(id.toString());

    console.log('nombres -->', this.taggedFriends);

    console.log('IDs -->', this.taggedFriendsId);

    console.log(this.tagsArray);
    this.tagsInput.reset();
    this.users$ = new Observable();

    console.log(this.tasgsInputValue);
    const data = [...this.tags, ...tag.split(' ')];
    console.log(data);
    this.tags = data.filter((item, index) => {
      return data.indexOf(item) === index;
    });
    this.tagsString = this.tags
      .join(' ')
      .split(' ')
      .map((item) => {
        if (item.includes('@')) {
          return item;
        }

        return `@${item}`;
      })
      .join(' ');
    console.log(this.tags);
    console.log(this.tagsString);
  }

  removeTag(tag: string) {
    const newTags = this.tags.filter((item) => item !== tag);
    this.tags = [...newTags];

    this.tags.length
      ? (this.tagsString = this.tags
          .join(' ')
          .split(' ')
          .map((item) => {
            if (item.includes('@')) {
              return item;
            }

            return `@${item}`;
          })
          .join(' '))
      : (this.tagsString = '');

    console.log(this.tagsString);
  }

  //Método para remover una imagen selecionada
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
        text: 'Escoger foto',
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
          this.selectVideo();
        },
      });
      // buttons.push({
      //   text: 'Subir video',
      //   icon: 'attach',
      //   handler: () => {
      //     this.fileInputVideo.nativeElement.click();
      //   },
      // });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleciona la fuente',
      buttons,
    });
    await actionSheet.present();
  }

  //Métod para agregar una imagen al arreglo para enviar
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
      // console.log(this.backgroundImages);
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

  //Convierte un base 64 en un BLOB
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

  //Convierte un BLOB en BASE64
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  //Captura el BASE64 de un archivo
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async geoCodeLatLong(latlng) {
    // This is making the Geocode request
    // const address = this.address;
    let address;
    console.log('TEST LAt Long', latlng);
    await this.geocoder.geocode(
      { location: latlng },
      function (results, status) {
        // console.log('TEST results', results);
        if (status !== google.maps.GeocoderStatus.OK) {
          alert(status);
        }
        // This is checking to see if the Geoeode Status is OK before proceeding
        if (status == google.maps.GeocoderStatus.OK) {
          // var address = results[0].formatted_address;

          //This is placing the returned address in the 'Address' field on the HTML form

          // address.setValue(
          //   `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`
          // );
          // console.log(address.value);
          address = `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`;
          console.log('Tu ubucación -->', address);
        }
      }
    );
    this.userAddress = address;
    console.log(this.userAddress);
    // this.address.setValue(address.value);
  }

  async openModal(message) {
    const modal = await this.modalCtrl.create({
      component: SuccessModalComponent,
      backdropDismiss: false,
      cssClass: 'request-modal',
      componentProps: {
        message,
        route: '/tabs/profile',
      },
    });

    await modal.present();
  }

  goBack() {
    this._location.back();
  }

  async onSubmit(description, files, ubication) {
    console.log('ubicación -->', ubication);
    let descriptionConcat;
    this.hashtagsString === undefined
      ? (descriptionConcat = description)
      : (descriptionConcat = description.concat(` ${this.hashtagsString} `));

    // this.tagsString === undefined
    //   ? descriptionConcat
    //   : (descriptionConcat = descriptionConcat.concat(` ${this.tagsString} `));

    console.log('description -->', descriptionConcat);

    if (ubication === '') ubication = 'En algún lugar';

    if (!this.platform.is('hybrid')) {
      console.log('ubicación -->', ubication);

      const loading = await this.loadingCtrl.create({
        cssClass: 'loading-ctrl',
        spinner: 'crescent',
      });
      await loading.present();
      await this.postsSvc
        .createPostWithImageFile(
          descriptionConcat,
          files,
          ubication,
          this.tagsArray,
          this.taggedFriends,
          this.taggedFriendsId
        )
        .subscribe((res) => {
          console.log(res);
          loading.dismiss();

          this.openModal('Publicación creada con éxito');
        });

      return;
    }

    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
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
