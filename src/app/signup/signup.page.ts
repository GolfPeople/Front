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
    private authSvc: AuthService
  ) {}

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
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$'
          ),
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
    // this.loading.dismissLoading();
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

  async signup({ email, name, username, password, password_confirmation }) {
    this.isLoading = true;
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
      })
      .subscribe(
        (res) => {
          this.loginService
            .login({ email, password })
            .subscribe((res) => console.log(res));
          console.log(res);
          this.isLoading = false;
          loading.dismiss();
          const code = res.message;
          const message = 'Usuario registrado con éxito';
          this.successAlert(code, '/complete-profile');
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

  async register(f) {
    try {
      const { email, password } = f.value;
      const user = await this.authSvc.register(email, password);
      if (user) {
        console.log('User -->', user);
        const isVerified = this.authSvc.isEmailVerified(user);
        // this.redirectUser(isVerified)
      }
    } catch (error) {}
  }

  private redirectUser(isVerified: boolean) {
    // redirect --> admin
    // else VerificationPage
    if (isVerified) {
      this.router.navigate(['/website']);
    } else {
      this.router.navigate(['/verify-email']);
    }
  }

  // signup({ email, name, password, password_confirmation }) {
  //   this.isLoading = true;
  //   this.loadingCtrl
  //     .create({
  //       cssClass: 'loading-ctrl',
  //     })
  //     .then((loadingEl) => {
  //       loadingEl.present();
  //       let authObs: Observable<SignupResponseData>;
  //       if (this.isSignedUp) {
  //         authObs = this.signupService.signup({
  //           email,
  //           name,
  //           password,
  //           password_confirmation,
  //         });
  //       }
  //       authObs.subscribe(
  //         (resData) => {
  //           this.loginService
  //             .login({ email, password })
  //             .subscribe((res) => console.log(res));
  //           console.log(resData);
  //           this.isLoading = false;
  //           loadingEl.dismiss();
  //           const code = resData.message;
  //           const message = 'Usuario registrado con éxito';
  //           // this.showSuccessAlert(message);
  //           this.successAlert(code, '/complete-profile');
  //         },
  //         (error) => {
  //           loadingEl.dismiss();
  //           let message;
  //           error === 'The email has already been taken.'
  //             ? (message = 'El email ya ha sido registrado.')
  //             : (message = 'Error de conexión');
  //           this.errorAlert(message);
  //           // this.showAlert(message);
  //         }
  //       );
  //     });
  // }

  onSubmit(f: FormGroup) {
    console.log(f.value);
    
    const formValue = f.value;
    // if (!form.valid) {
    //   return;
    // }
    // const email = form.value.email;
    // const name = form.value.name;
    // const password = form.value.password;
    // const rePassword = form.value.rePassword;

    this.signup(formValue);
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
