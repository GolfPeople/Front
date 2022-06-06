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
    private authSvc: AuthService
  ) {}

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

  login({ email, password }) {
    this.loadingSvc.presentLoading();

    this.loginService.login({ email, password }).subscribe(
      () => {
        // this.loginService.isLogged$.subscribe((data) => console.log(data));
        this.isLoading = false;
        this.userService.getUserInfoToSave();
        this.loadingCtrl.dismiss();
        this.router.navigate(['/website']);
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
  async onLoginFb({ email, password }) {
    try {
      const user = await this.authSvc.login(email, password);
      if (user) {
        //Todo: CheckEmail
        const isVerified = this.authSvc.isEmailVerified(user);
        // this.redirectUser(isVerified)
      }
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  async onLoginGoogle() {
    try {
      const user = await this.authSvc.loginGoogle();
      if (user) {
        //Todo: CheckEmail
        const isVerified = this.authSvc.isEmailVerified(user)
        // this.redirectUser(isVerified)
      }
    } catch (error) {
      console.log('Error -->', error);
    }
  }

  private redirectUser(isVerified: boolean) {
    // redirect --> admin 
    // else VerificationPage
    if(isVerified) {
      this.router.navigate(['/website'])
    } else {
      this.router.navigate(['/verify-email'])
    }
  }

  onSubmit(f: FormGroup) {
    const form = f.value;

    this.login(form);
    this.onLoginFb(form);
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
