/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import {
  SignupService,
  SignupResponseData,
} from '../core/services/signup.service';
import { LoginService } from '../core/services/login.service';
import { Observable } from 'rxjs';
import { SuccessComponent } from '../shared/alerts/success/success.component';
import { LoadingService } from '../core/services/loading/loading.service';
import { ErrorComponent } from '../shared/alerts/error/error.component';
import { MyValidations } from '../utils/my-validations';
import { AuthService } from '../core/services/auth.service';
import { FirebaseService } from '../services/firebase.service';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  passwordType = 'password';
  eye = 'eye';
  isLoading = false;
  isSignedUp = true;
  form: FormGroup;
  termsChecked = false;
  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password').value;
    let confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notSame: true };
  };

  constructor(
    private signupService: SignupService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private loginService: LoginService,
    private modalCtrl: ModalController,
    private fb: FormBuilder,
    private authSvc: AuthService,
    private firebaseSvc: FirebaseService,
    private loadingSvc: LoadingService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.form = this.initForm();
  }

  initForm() {
    return this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          // Validators.pattern(
          //   '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$'
          // ),
        ],
      ],
      password_confirmation: [
        '',
        [Validators.required, MyValidations.matchValues('password')],
      ],
      checked: [false, Validators.requiredTrue],
    });
  }


  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.eye = this.eye === 'eye-off' ? 'eye' : 'eye-off';
  }

  async successAlert(message, route) {
    const modal = await this.modalCtrl.create({
      component: SuccessComponent,
      backdropDismiss: false,
      cssClass: 'success-alert',
      componentProps: {
        message,
        route,
      },
    });

    await modal.present();
  }

  async errorAlert(message) {
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

  async signup({ email, name, username, password, password_confirmation }, uid) {

    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.signupService
      .signup({
        email,
        name,
        username,
        password,
        password_confirmation,
      }, uid)
      .subscribe(
        (res) => {
          this.loginBeforeRegister({ email, password });
          loading.dismiss();
        },
        (error) => {
          loading.dismiss();
          let message;
          error === 'The email has already been taken.'
            ? (message = 'El email ya ha sido registrado.')
            : (message = 'Error de conexión');
          this.errorAlert(message);
        }
      );
  }

  loginBeforeRegister(user) {
    this.loadingSvc.presentLoading();
    this.loginService
      .login(user)
      .subscribe((res) => {
        localStorage.setItem('token', res.access_token);
        this.getUserInfo();
        this.loadingCtrl.dismiss();
      }, error => {
        this.loadingCtrl.dismiss();
      });

  }

  getUserInfo() {
    this.loadingSvc.presentLoading();
    this.userService.getUserInfoToSave().subscribe((data) => {
      this.userService.user.next(data);
      this.userService.userPhoto.next(data.profile.photo);
      this.loadingCtrl.dismiss();

      localStorage.setItem('user_id', data.id)

      this.router.navigate(['/complete-profile']);

    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      this.loadingCtrl.dismiss();
    });
  }

  async register(f) {
    this.loadingSvc.presentLoading();
    try {
      const { email, password } = f.value;
      const user = await this.authSvc.register(email, password);
      if (user) {

        this.signup(f.value, user.uid);

        const isVerified = this.authSvc.isEmailVerified(user);
        this.loadingCtrl.dismiss();
      }
    } catch (error) {
      this.firebaseSvc.Toast(error.error)
      this.loadingCtrl.dismiss();
    }
  }

  onSubmit(f: FormGroup) {
    const formValue = f.value;
    this.register(f);
  }

  private showSuccessAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Registro Exitoso',
        message,
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.router.navigateByUrl('/complete-profile');
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({ header: 'Registro Fallido', message, buttons: ['Aceptar'] })
      .then((alertEl) => alertEl.present());
  }
}
