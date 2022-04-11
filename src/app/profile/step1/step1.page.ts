import { Component, OnInit, Sanitizer } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
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
  public previsualizacion: string;
  public archivos: any = [];
  isLoading = false;
  isSignedUp = true;
  userName: string = '';
  license = '';
  selectedImage: any;

  imageAvatarDefault = 'assets/img/default-avatar.png';
  file: File;

  constructor(
    private step1Service: Step1Service,
    private router: Router,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private fileService: FilesService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    this.userService
      .getUserInfo()
      .subscribe((user) => (this.userName = user.name));
    // this.loginService.isLogged$.subscribe((rta) => {
    //   if (rta === false) {
    //     localStorage.removeItem('userImage');
    //   }
    //   return;
    // });
  }

  selectImage(event: Event) {
    const element = event.target as HTMLInputElement;
    const file = element.files?.item(0);

    // const archivoCapturado = event.target.files[0];
    this.selectedImage = event.target;
    this.extraerBase64(file).then((imagen: any) => {
      this.previsualizacion = imagen.base;
    });

    this.file = file;
    // this.archivos.push(archivoCapturado);
  }

  extraerBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        const unsafeImg = window.URL.createObjectURL($event);
        const image = this.sanitizer.bypassSecurityTrustUrl(unsafeImg);
        const reader = new FileReader();
        reader.readAsDataURL($event);
        reader.onload = () => {
          resolve({
            base: reader.result,
          });
          reader.onerror = (error) => {
            resolve({
              base: null,
            });
          };
        };
      } catch (e) {
        return null;
      }
    });

  async onUpload() {
    this.isLoading = true;
    if (this.file && this.license) {
      this.fileService.uploadFile(this.file, this.license).subscribe(
        (rta) => {
          console.log(this.file);
          console.log(rta);
          this.isLoading = false;
          this.router.navigate(['/step2']);
        },
        (error) => {
          const code = error.message;
          let message = 'Datos incorrectos, intenta de nuevo.';
          if (code === 'Credenciales incorrectas') {
            message = 'Datos incorrectos, intenta de nuevo.';
          }
        }
      );
      setTimeout(() => {
        this.userService.getUserInfo().subscribe((rta) => console.log(rta));
      }, 3000);
    } else {
      return window.alert('Los campos son obligatorios!');
    }
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Inicio de sesión fallido',
        message,
        buttons: ['Aceptar'],
      })
      .then((alertEl) => alertEl.present());
  }
  // onUpload() {
  //   // const element = event.target as HTMLInputElement;
  //   const element = this.selectedImage as HTMLInputElement;
  //   const file = element.files?.item(0);
  //   if (file) {
  //     this.fileService
  //       .uploadFile(file, this.license)
  //       .subscribe((rta) => console.log(rta));
  //   }
  // }

  // subirArchivo(): any {
  //   try {
  //     const formularioDeDatos = new FormData();
  //     this.archivos.forEach(archivo => {
  //       formularioDeDatos.append('photo', archivo)
  //     });
  //     this.fileService.uploadFile(formularioDeDatos, this.license)
  //     .subscribe(
  //       data => console.log(data)
  //     )
  //   } catch (error) {

  //   }
  // }

  // async selectImage(){
  //   const image = await Camera.getPhoto({
  //     quality: 60,
  //     allowEditing: true,
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Photos,
  //     correctOrientation: true,
  //     width: 250
  //   });

  //   const imageUrl = image.webPath;
  //   this.imageAvatarDefault = imageUrl;
  //   this.saveImage(image);

  // };

  //   async saveImage(photo: Photo){
  //     const base64Data = await this.readAsBase64(photo);

  //     const fileName = new Date().getTime() + '.jpeg';

  //     const loading = await this.loadingCtrl.create({
  //       message: 'Cargando imagen...',
  //     });
  //     await loading.present();

  //     const savedFile = await Filesystem.writeFile({
  //       directory: Directory.Data,
  //       path: `${IMAGE_DIR}/${fileName}`,
  //       data: base64Data
  //     }).then(_ =>{
  //       loading.dismiss();
  //     });
  // //    this.loadFile();
  //   }

  //   async readAsBase64(photo: Photo){
  //     if (this.platform.is('hybrid')){
  //       const file = await Filesystem.readFile({
  //         path: photo.path
  //       });

  //       return file.data;
  //     }
  //     else{
  //       const response = await fetch(photo.webPath);
  //       const blob = await response.blob();

  //       return await this.convertBlobToBase64(blob) as string;
  //     }

  //   }

  //   convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       resolve(reader.result);
  //     };
  //     reader.readAsDataURL(blob);
  //   });

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
