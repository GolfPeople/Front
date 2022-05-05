import { Component, OnInit, Sanitizer } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Step1Service, UploadDataS1ResponseData } from './step1.service';
import { Observable } from 'rxjs';

import { UserService } from 'src/app/core/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FilesService } from 'src/app/core/services/files.service';
import { LoginService } from 'src/app/core/services/login.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// importaciones para la captura, guardar y subir la imagen
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
  CameraOptions,
} from '@capacitor/camera';
import { finalize } from 'rxjs/operators';

const IMAGE_DIR = 'stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-step1',
  templateUrl: './step1.page.html',
  styleUrls: ['./step1.page.scss'],
})
export class Step1Page implements OnInit {
  // public archivos: any = [];
  // isLoading = false;
  // isSignedUp = true;
  // userName: string = '';
  // license = '';
  // selectedImage: any;
  // public file: ImageData;

  images: LocalFile[] = [];
  previsualizacion;
  userName: string;
  license: string = '';

  imageAvatarDefault = 'assets/img/default-avatar.png';
  file: File;
  isDisabled: boolean = false;

  constructor(
    private step1Service: Step1Service,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private fileService: FilesService,
    private loginService: LoginService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    this.userService.getUserInfo().subscribe((res) => {
      this.userName = res.name;
      res.profile.license === null
        ? (this.license = '')
        : (this.license = res.profile.license);
      res.profile.photo
        ? (this.imageAvatarDefault = res.profile.photo)
        : (this.imageAvatarDefault = 'assets/img/default-avatar.png');
    });
    this.loadFiles();
  }

  disabled() {
    this.isDisabled = !this.isDisabled;
    this.license = '';
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
          console.log('loadFileData', result);
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
      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
    });
    if (image) {
      const imageUrl = image.webPath;
      this.imageAvatarDefault = imageUrl;
      this.saveImage(image);
    }
    this.loadFiles();
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
    });
    this.loadFiles();
  }

  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });
      return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

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
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('photo', blob, file.name);
    formData.append('license', this.license);
    console.log('blob a enviar -->', blob);
    console.log('blob del formData -->', formData.get('photo'));
    this.uploadData(formData);
  }

  async uploadData(formData: FormData) {
    const url = 'https://www.api.app.golfpeople.com/api/auth/profile/1';

    this.http
      .post(url, formData)
      .pipe(
        finalize(() => {
          // loading.dismiss();
        })
      )
      .subscribe((res) => {
        this.userService.getUserInfo().subscribe((rta) => {});
      });
  }
}
