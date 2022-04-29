import { Component, OnInit, AfterViewInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
// import { Camera, GalleryImageOptions, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { finalize } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesService } from 'src/app/core/services/files.service';
import { LoginService } from 'src/app/core/services/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SuccessComponent } from '../success/success.component';

const IMAGE_DIR = 'stored-images';

declare var google: any;

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
  imgs = [];
  autocomplete;
  images: LocalFile[] = [];

  latitud: any;
  longitude: any;

  selectedImage = '';

  textArea;
  address;
  filesToSend;

  private apiUrl = `${environment.golfpeopleAPI}/api`;

  constructor(
    private userService: UserService,
    private modalCtrl: ModalController,
    private loader: LoadingController,
    private platform: Platform,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private sanitizer: DomSanitizer,
    private fileService: FilesService,
    private loginService: LoginService,
    private http: HttpClient
  ) {
    this.initAutoComplete();
  }

  ngOnInit() {
    // this.initAutoComplete();
  }

  onSubmit(description, chareacters, files) {
    this.openModal();
    this.closeModal();
    return this.http
      .post(`${this.apiUrl}/publish`, { description, chareacters, files })
      .subscribe((res) => {
        console.log('RESpuesta,', res);
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

  // async pickImages() {
  //   this.loader
  //     .create({
  //       message: 'Cargando',
  //     })
  //     .then((ele) => {
  //       ele.present();
  //       const options: GalleryImageOptions = {
  //         correctOrientation: true,
  //       };
  //       Camera.pickImages(options).then((val) => {
  //         console.log('val pick images-->', val);
  //         const images = val.photos;
  //         this.imgs = [];
  //         console.log(images);
  //         this.imgs = val.photos.map((img) => img.webPath);

  //         // console.log('IMAGES', this.images);
  //         // for (let i = 0; 1 < images.length; i++) {
  //         //   this.imgs.push(images[i].webPath);
  //         // }
  //         // for (let image of images) {
  //         //   // console.log('TEST pictures');
  //         //   this.readAsBase64(image.webPath).then((res) => {
  //         //     console.log('RES-->', res);
  //         //     this.imgs.push(res);
  //         //   });
  //         //   // this.imgs.push(image.webPath);
  //         // }
  //         console.log(this.imgs);
  //         ele.dismiss();
  //       });
  //     });
  // }

  async openModal() {
    // this.isOpen = true;
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

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Cargando imagen...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    })
      .then(
        (result) => {
          console.log('HERE: ', result);
          this.loadFilesData(result.files);
          // this.imageAvatarDefault = result.files[result.files.length - 1]
        },
        async (err) => {
          await Filesystem.mkdir({
            directory: Directory.Data,
            path: IMAGE_DIR,
          });
        }
      )
      .then((_) => {
        loading.dismiss();
      });
  }

  async loadFilesData(filesNames: string[]) {
    for (let f of filesNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath,
      });
      // console.log('READ: ', readFile)
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
      // this.previsualizacion = this.images[this.images.length - 1].data;
      // this.imageAvatarDefault = this.images[this.images.length - 1].data;
    }
    this.filesToSend = this.images.filter((item) => item.data);
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    console.log(image);

    if (image) {
      const imageUrl = image.webPath;
      console.log(imageUrl);
      this.selectedImage = imageUrl;
      this.saveImage(image);
    }
    this.loadFiles();
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
    console.log('Saved: ', savedFile);
    this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    console.log('TEST image -->', photo);
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      console.log('BLOB TEST -->', blob);

      return (await this.convertBlobToBase64(blob)) as string;
    }
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

  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    const formData = new FormData();
    formData.append('photo', blob, file.name);
    this.uploadData(formData);
    // this.router.navigate(['/step6']);
  }

  async uploadData(formData: FormData) {
    // const loading = await this.loadingCtrl.create({
    //   message: 'Subiendo imagen..',
    // });
    // await loading.present();

    const url = 'https://www.api.app.golfpeople.com/api/auth/profile/1';

    this.http
      .post(url, formData)
      .pipe(
        finalize(() => {
          // loading.dismiss();
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.userService.getUserInfo().subscribe((rta) => {
          console.log('User info -->', rta);
        });
      });
  }
}
