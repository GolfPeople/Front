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

  imageAvatarDefault = 'assets/img/default-avatar.png';

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
    // console.log(this.selectImage())
    this.loadFiles()
    // this.imageAvatarDefault = this.images[this.images.length - 1].data
  }

  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Loading data...'
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR
    }).then(result => {
      console.log('HERE: ', result)
      this.loadFilesData(result.files)
      // this.imageAvatarDefault = result.files[result.files.length - 1]
    }, async err => {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR
      });
    }).then(_ => {
      loading.dismiss()
    })
  }

async loadFilesData(filesNames: string[]) {
  for (let f of filesNames) {
    const filePath = `${IMAGE_DIR}/${f}`

    const readFile = await Filesystem.readFile({
      directory: Directory.Data,
      path: filePath
    })
    // console.log('READ: ', readFile)
    this.images.push({
      name: f,
      path: filePath,
      data: `data:image/jpeg;base64,${readFile.data}`
    })
    this.previsualizacion = this.images[this.images.length - 1].data;
    // this.imageAvatarDefault = this.images[this.images.length - 1].data;
  }
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
        this.imageAvatarDefault = imageUrl;
      this.saveImage(image)
    }
    this.loadFiles()
  }

  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data)

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
    if(this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path
      })
      return file.data
    }
    else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }

  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob)
  })

  async startUpload(file: LocalFile) {
    const response = await fetch(file.data);
    console.log(response);
    const blob = await response.blob();
    console.log(blob);
    const formData = new FormData();
    formData.append('photo', blob, file.name);
    this.uploadData(formData)
  }

  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Subiendo imagen..'
    });
    await loading.present();

    const url = 'https://www.api.app.golfpeople.com/api/auth/profile/1'

    this.http.post(url, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res)
      this.userService.getUserInfo().subscribe(rta => {
        console.log('User info -->',rta)
      })
    })
  }
}
