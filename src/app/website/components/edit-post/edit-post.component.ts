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
import { Observable } from 'rxjs';
import { Friend } from 'src/app/core/models/friend.interface';
import { FriendsService } from 'src/app/core/services/friends.service';
import { finalize, map } from 'rxjs/operators';

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

  imageAvatarDefault = 'assets/img/default-avatar.png';

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

  //tags
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
    private domSanitizer: DomSanitizer,
    private friendsSvc: FriendsService
  ) {
    // this.initAutoComplete();
  }

  ngAfterViewInit(): void {
    // this.initAutoCom();
  }
  async ngOnInit() {
    console.log(this.post);
    const { description, location, hashtags, tags } = this.initFormControls();
    this.textArea = description;
    this.address = location;
    this.hashtagsInput = hashtags;
    this.tagsInput = tags;
    this.editPost = true;
    this.textArea.setValue(this.post.description);
    this.address.setValue(this.post.ubication);
    this.blobArrayData = this.post.files;
    this.backgroundImagesEdit = this.post.files;
    console.log(this.post.files);
    this.hashtags = JSON.parse(this.post.hashtags);
    this.hashtagsString = this.hashtags
      .map((item) => {
        if (item.includes('#')) {
          return item;
        }

        return `#${item}`;
      })
      .join(' ');
    console.log(this.hashtags);
    console.log(this.hashtagsString);
    this.userAddress = this.address.value;
    // }

    if (this.post.friends_name !== null) {
      this.tags = JSON.parse(this.post.friends_name).split(',');
      console.log(this.taggedFriends);
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
    const hashtags = new FormControl('', {});
    const tags = new FormControl('', {});

    return { description, location, hashtags, tags };
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
      // .join(' ')
      // .split(' ')
      .map((item) => {
        if (item.includes('#')) {
          return item;
        }

        return `#${item}`;
      })
      .join(' ');
    console.log(this.hashtags);
    console.log('hashtagsString', this.hashtagsString);
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

  tag(value) {
    // const element = event.target as HTMLInputElement;
    // const value = element.value;
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
        finalize(() => {
          // this.isLoading = false;
        })
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

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
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

  descriptionValue() {
    console.log(this.textArea.value);
  }

  async edit(description, ubication, files) {
    const descriptionConcat = description.concat(
      ` ${this.hashtagsString ? this.hashtagsString : ''}`
    );
    console.log('description -->', descriptionConcat);
    console.log('edit files -->', files);
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    await this.postsSvc
      .editPost(descriptionConcat, [], this.userAddress, this.post.id)
      .subscribe((res) => {
        this.postsSvc.getPostsAction();
        loading.dismiss();
        this.openModal('Su publicación ha sido editada con éxito');
      });

    this.closeModal();
  }
}
