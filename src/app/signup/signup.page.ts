/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { SignupService, SignupResponseData } from './signup.service';
import { Observable } from 'rxjs';

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

  constructor(
    private signupService: SignupService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }


  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.eye = this.eye === 'eye-off' ? 'eye' : 'eye-off';
  }

  signup(email: string, name: string, password: string, password_confirmation: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Registrando...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<SignupResponseData>;
        if (this.isSignedUp) {
          authObs = this.signupService.signup(email, name, password, password_confirmation);
        }
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            const code = resData.message;
            const message = 'El usuario se ha registrado satisfactoriamente.';
            this.showSuccessAlert(message);
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.message;
            let message = 'No se pudo resgistrar. Intenta de nuevo.';
            if (code === 'Credenciales incorrectas') {
              message = 'Datos incorrectos, intenta de nuevo.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const name = form.value.name;
    const password = form.value.password;
    const rePassword = form.value.rePassword;

    this.signup(email, name, password, rePassword);

  }

  private showSuccessAlert(message: string){
    this.alertCtrl.create(
      {header: 'Registro Exitoso',
      message,
      buttons: [{
        text:'Aceptar',
        handler: () => {this.router.navigateByUrl('/login');}
      }]
      }
    ).then(alertEl => alertEl.present());
  }

  private showAlert(message: string){
    this.alertCtrl.create({header: 'Registro Fallido', message, buttons: ['Aceptar']}).then(alertEl => alertEl.present());
  }


}
