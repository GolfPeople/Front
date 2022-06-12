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
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SuccessComponent } from '../../components/success/success.component';
import { SwiperComponent } from 'swiper/angular';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { PostsService } from 'src/app/core/services/posts.service';
import { Post, PostToEdit } from 'src/app/core/interfaces/interfaces';
import { DomSanitizer } from '@angular/platform-browser';

declare var google: any;
declare var window: any;

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.page.html',
  styleUrls: ['./edit-post.page.scss'],
})
export class EditPostPage implements OnInit {
  @Input() type: number;
  @Input() postId: number;

  // Post data
  @Input() postDescription: string;
  @Input() postFiles;
  @Input() postLocation: string;
  @Input() postHashtags = [];
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
  editPost: PostToEdit;
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

  private apiUrl = `${environment.golfpeopleAPI}/api`;

  constructor(
    private modalCtrl: ModalController,
    private geolocationService: GeolocationService,
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private actRoute: ActivatedRoute
  ) {
    // this.initAutoComplete();
  }

  ngAfterViewInit(): void {
    this.initAutoCom();
  }
  async ngOnInit() {
    const { description, location, hashtags } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    this.hashtagsInput = hashtags;
    const coordinates = await this.geolocationService.currentPosition();
    const { latitude, longitude } = await coordinates.coords;
    this.coords = { lat: latitude, lng: longitude };

    // this.actRoute.paramMap.subscribe(param => {
    //   this.editPost = param.get('post')
    // })

    this.textArea.setValue(this.postDescription);

    this.address.setValue(this.postLocation);
    // this.tempImages = this.postFiles;
    this.blobArrayData = this.postFiles;
    this.backgroundImagesEdit = this.postFiles;
    console.log(this.postFiles);
    this.hashtags = this.postHashtags;
    // }
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

  initAutoCom() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('location') as HTMLInputElement,
      {
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
      if (status == google.maps.GeocoderStatus.OK) {
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

  async edit(description, ubication, files) {
    const descriptionConcat = description.concat(` ${this.hashtagsString}`);
    console.log('description -->', descriptionConcat);
    console.log('edit files -->', files);
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc.editPost(descriptionConcat, [], ubication, this.postId);
    await loading.dismiss();

    this.openModal('Su publicación ha sido editada exitosamente');
  }
}
