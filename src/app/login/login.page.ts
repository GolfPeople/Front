import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { LoginService, LoginResponseData} from './login.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  passwordType = 'password';
  eye = 'eye';
  isLoading = false;
  isLogin = true;

  constructor(
    private loginService: LoginService,
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


  login(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Iniciando sesión...' })
      .then(loadingEl => {
        loadingEl.present();
        let authObs: Observable<LoginResponseData>;
        if (this.isLogin) {
          authObs = this.loginService.login(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/home');
          },
          errRes => {
            loadingEl.dismiss();
            const code = errRes.message;
            let message = 'Datos incorrectos, intenta de nuevo.';
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
    const password = form.value.password;

    this.login(email, password);
  }

  private showAlert(message: string){
    this.alertCtrl.create({header: 'Inicio de sesión fallido', message, buttons: ['Aceptar']}).then(alertEl => alertEl.present());
  }
}
