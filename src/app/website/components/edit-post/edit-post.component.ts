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
import { SuccessComponent } from '../success/success.component';
import { SwiperComponent } from 'swiper/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { Post, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { DomSanitizer } from '@angular/platform-browser';

declare var google: any;
declare var window: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent implements OnInit {
  @ViewChild('swiper') swiper: SwiperComponent;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('fileInputVideo', { static: false }) fileInputVideo: ElementRef;
  @Input() type: number;
  @Input() postId: number;

  // Post data
  @Input() postDescription: string;
  @Input() postFiles;
  @Input() postLocation: string;
  @Input() postHashtags = [];
  @Input() post: PostsResponse;
  // google maps
  autocomplete: any;
  geocoder = new google.maps.Geocoder();
  coords;

  latitud: any;
  longitude: any;

  textArea: FormControl;
  address: FormControl;
  filesToSend;

  //Crop image
  imageDAtaUrl: any;
  croppedImage: any;

  postImages = [];
  editPost: boolean = false;
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

  //ngx autocomplete
  title = 'google-places-autocomplete';
  userAddress: string = '';
  userLatitude: string = '';
  userLongitude: string = '';

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
    // this.initAutoCom();
  }
  async ngOnInit() {
    console.log(this.post);
    const { description, location, hashtags } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    this.hashtagsInput = hashtags;
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };
    // this.geoCodeLatLong(this.coords);
    // if (this.type === 2) {
    this.editPost = true;
    this.textArea.setValue(this.post.description);
    this.userAddress = this.address.value;
    this.address.setValue(this.post.ubication);
    // this.tempImages = this.postFiles;
    this.blobArrayData = this.post.files;
    this.backgroundImagesEdit = this.post.files;
    console.log(this.post.files);
    this.hashtags = JSON.parse(this.post.hashtags);
    console.log(this.hashtags);
    // }
  }

  ngAfterContentChecked(): void {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  initFormControls() {
    const description = new FormControl('', {});
    const location = new FormControl('', {});
    const hashtags = new FormControl('', {});
    return { description, location, hashtags };
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

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
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

  // geoCodeLatLong(latlng) {
  //   // This is making the Geocode request
  //   const address = this.address;
  //   console.log('TEST LAt Long', latlng);
  //   this.geocoder.geocode({ location: latlng }, function (results, status) {
  //     console.log('TEST results', results);
  //     if (status !== google.maps.GeocoderStatus.OK) {
  //       alert(status);
  //     }
  //     // This is checking to see if the Geoeode Status is OK before proceeding
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       // var address = results[0].formatted_address;

  //       //This is placing the returned address in the 'Address' field on the HTML form

  //       address.setValue(
  //         `${results[0].address_components[3].long_name} ${results[0].address_components[6].long_name}`
  //       );
  //       console.log(address.value);
  //     }
  //   });
  //   this.address.setValue(address.value);
  // }

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

  descriptionValue() {
    console.log(this.textArea.value);
  }

  async edit(description, ubication, files) {
    const descriptionConcat = description.concat(` ${this.hashtagsString}`);
    console.log('description -->', descriptionConcat);
    console.log('edit files -->', files);
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc.editPost(
      descriptionConcat,
      [],
      this.userAddress,
      this.postId
    );
    await loading.dismiss();

    this.openModal('Su publicación ha sido editada exitosamente');
    this.closeModal();
  }
}
