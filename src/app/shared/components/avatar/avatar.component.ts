import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { HttpClient } from '@angular/common/http';

// importaciones para la captura, guardar y subir la imagen
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Step1Service } from 'src/app/profile/step1/step1.service';
import { CropperComponent } from '../cropper/cropper.component';
import { environment } from '../../../../environments/environment';
import { PostsService } from 'src/app/core/services/posts.service';

const URL = `${environment.golfpeopleAPI}/api/auth/photo`;

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  // @Input() src;
  imageAvatarDefault = 'assets/img/default-avatar.png';

  imageAvatar;

  //Crop image
  imageDAtaUrl: any;
  croppedImage: any;
  backgroundImages = [];
  blobArrayData: Blob[] = [];

  constructor(
    private userService: UserService,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private step1Service: Step1Service,
    private http: HttpClient,
    private postsSvc: PostsService
  ) {
    this.userService.user$.subscribe((data) => {
      // if (data.profile.photo) this.imageAvatar = data.profile.photo;
    });
    this.userService.userPhoto$.subscribe((photo) => {
      if (photo) this.imageAvatar = photo;
    });
  }

  ngOnInit() {
    // this.userService.getUserInfo().subscribe(({ profile }) => {
    //   if (profile.photo) {
    //     this.imageAvatarDefault = profile.photo;
    //   }
    // });
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

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleciona la fuente',
      buttons,
    });
    await actionSheet.present();
  }

  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 60,
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
    croppperModal.onDidDismiss().then(async (data) => {
      this.croppedImage = data.data;
      this.backgroundImages.push(this.croppedImage);
      this.imageAvatar = this.croppedImage;
      // console.log(this.backgroundImages);
      const blobData = this.b64toBlob(
        this.croppedImage,
        `image/${image.format}`
      );
      await this.blobArrayData.push(blobData);
      this.onSubmit(this.blobArrayData[this.blobArrayData.length - 1]);
    });
    await croppperModal.present();
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

  onSubmit(file) {
    const formData = new FormData();
    const fileName = `${file.size}123`;
    formData.append('photo', file, fileName);
    this.http.post(URL, formData).subscribe((res) => res);
    // this.postsSvc.getPosts();
    this.userService.updatePhoto(this.imageAvatar);
    // this.step1Service.uploadDataS1(this.blobArrayData[this.blobArrayData.length-1], '').
    // subscribe(res => res)
  }
}
