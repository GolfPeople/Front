import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Step1Service, UploadDataS1ResponseData } from './step1.service';
import { Observable } from 'rxjs';

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

  isLoading = false;
  isSignedUp = true;

  imageAvatarDefault = 'assets/img/default-avatar.png';

  constructor(
    private step1Service: Step1Service,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  async ngOnInit() {

  }


  async selectImage(){
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos,
      correctOrientation: true,
      width: 250
    });

    const imageUrl = image.webPath;
    this.imageAvatarDefault = imageUrl;
    this.saveImage(image);

  };

  async saveImage(photo: Photo){
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';

    const loading = await this.loadingCtrl.create({
      message: 'Cargando imagen...',
    });
    await loading.present();

    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data
    }).then(_ =>{
      loading.dismiss();
    });
//    this.loadFile();
  }

  async readAsBase64(photo: Photo){
    if (this.platform.is('hybrid')){
      const file = await Filesystem.readFile({
        path: photo.path
      });

      return file.data;
    }
    else{
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }

  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

/*
  uploadDataS1(image: string, licence: string, userToken: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Guardando...' })
      .then(loadingEl => {
        loadingEl.present();
        let uplS1Obs: Observable<UploadDataS1ResponseData>;
        if (this.isSignedUp) {
          uplS1Obs = this.step1Service.uploadDataS1(image, licence, userToken);
        }
        uplS1Obs.subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            const code = resData.message;
            const message = 'Datos guardados satisfactoriamente';
            this.showSuccessAlert(message);
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.message;
            const message = 'No se pudo guardar. Intenta de nuevo.';
          /*  if (code === 'Credenciales incorrectas') {
              message = 'Datos incorrectos, intenta de nuevo.';

            this.showAlert(message);
          }
        );
      });
  }
/*
  async onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    let file: LocalFile;
    const image = await fetch(file.data);
    const licence = form.value.licence;

    this.uploadDataS1(image, licence);

  }
*/
/*
  private showSuccessAlert(message: string){
    this.alertCtrl.create({
      header: 'Registro Exitoso',
      message,
      buttons: [{
        text:'Aceptar',
        handler: () => {this.router.navigateByUrl('/step2');}
      }]
      }
    ).then(alertEl => alertEl.present());
  }

  private showAlert(message: string){
    this.alertCtrl.create({
      header: 'Registro Fallido',
      message,
      buttons: ['Aceptar']
    }).then(alertEl => alertEl.present());
  }
*/
}
