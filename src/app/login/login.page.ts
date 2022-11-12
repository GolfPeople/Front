import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {
  LoadingController,
  AlertController,
  ModalController,
  Platform,
} from '@ionic/angular';
import {
  LoginService,
  LoginResponseData,
} from '../core/services/login.service';
import { Observable } from 'rxjs';

import { LoadingService } from '../core/services/loading/loading.service';
import { ErrorComponent } from '../shared/alerts/error/error.component';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';

const TOKEN_DIR = 'session';


import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { FirebaseService } from '../services/firebase.service';
import { SuccessComponent } from '../shared/alerts/success/success.component';
interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  passwordType = 'password';
  eye = 'eye';
  isLoading = false;
  form: FormGroup;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private loadingSvc: LoadingService,
    private modalCtrl: ModalController,
    private userService: UserService,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.form = this.initForm();
  }

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    // this.eye = this.eye === 'eye-off' ? 'eye' : 'eye-off';
  }

  initForm() {
    return this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [, Validators.required]],
    });
  }


  login(user) {
    this.loadingSvc.presentLoading();
    this.firebaseSvc.Login(user).then(res => {
      this.loadingCtrl.dismiss();
      console.log(res);

      this.loginDB(user)
    }, error => {
      this.loadingCtrl.dismiss();
      this.firebaseSvc.Toast(error.error);
    })
  }

  loginDB({ email, password }) {
    this.loadingSvc.presentLoading();


    this.loginService.login({ email, password }).subscribe(
      (res) => {
        localStorage.setItem('token', res.access_token);
        // this.loginService.isLogged$.subscribe((data) => console.log(data));
        this.isLoading = false;
        this.getUserInfo(false);
        this.loadingCtrl.dismiss();

      },
      (errRes) => {
        this.loadingCtrl.dismiss();
        let message;
        errRes === 'Credenciales incorrectas'
          ? (message = 'Datos incorrectos, intenta de nuevo.')
          : (message = 'Error de conexión');
        // this.showAlert(message);
        this.errorAlert(message);
      }
    );
  }

  getUserInfo(isNewUser) {
    this.loadingSvc.presentLoading();
    this.userService.getUserInfoToSave().subscribe((data) => {
      this.userService.user.next(data);
      this.userService.userPhoto.next(data.profile.photo);
      this.loadingCtrl.dismiss();

      localStorage.setItem('user_id', data.id)

      if (isNewUser) {
        this.router.navigate(['/complete-profile']);
      } else {
        this.router.navigate(['/tabs']);
      }

    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      this.loadingCtrl.dismiss();
    });
  }

  async onLoginFacebook() {

    try {
      const user = await this.authSvc.loginFacebook();
      if (user) {

        let userInformation = user.user.multiFactor.user;

        const { email, displayName, uid } = userInformation;
        if (uid) {
          const loading = await this.firebaseSvc.loader().create();
          await loading.present();

          this.loginService
            .socialLogin('facebook', email, displayName, uid)
            .subscribe((res) => {
              loading.dismiss();
              localStorage.setItem('token', res.access_token);
              this.getUserInfo(user.additionalUserInfo.isNewUser);
            }, error => {
              loading.dismiss();
            });

          const isVerified = this.authSvc.isEmailVerified(user);
        } else {
          this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
        }
      }
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async onLoginGoogle() {

    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {

        let userInformation = user.user.multiFactor.user;

        const { email, displayName, uid } = userInformation;

        if (uid) {
          const loading = await this.firebaseSvc.loader().create();
          await loading.present();

          this.loginService
            .socialLogin('google', email, displayName, uid)
            .subscribe((res) => {

              loading.dismiss();
              this.getUserInfo(user.additionalUserInfo.isNewUser);

            }, error => {
              loading.dismiss();
            });

          const isVerified = this.authSvc.isEmailVerified(user);
        } else {
          this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
        }


      }
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  private redirectUser(isVerified: boolean) {
    // redirect --> admin
    // else VerificationPage
    if (isVerified) {
      this.router.navigate(['/tabs']);
    } else {
      this.router.navigate(['/verify-email']);
    }
  }

  onSubmit(f: FormGroup) {
    const form = f.value;
    this.login(form);
  }

  async errorAlert(message) {
    // this.loading.dismissLoading();

    const modal = await this.modalCtrl.create({
      component: ErrorComponent,
      backdropDismiss: true,
      cssClass: 'error-alert',
      componentProps: {
        message,
      },
    });

    await modal.present();
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
}
