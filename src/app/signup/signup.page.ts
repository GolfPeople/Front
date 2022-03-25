import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { SignupService } from './signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  passwordType = 'password';
  eye = 'eye';

  constructor(
    private signupService: SignupService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }


  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.eye = this.eye === 'eye-off' ? 'eye' : 'eye-off';
  }

  onSubmit(form: NgForm){
    if(!form.valid){
      return;
    }
    const email = form.value.email;
    const name = form.value.name;
    const password = form.value.password;
    const rePassword = form.value.rePassword;

    this.signupService.signup(email, name, password, rePassword).subscribe(resData => {
      console.log(resData);
    }, errRes =>{
        const code = errRes.message;
        let message = 'No se pudo resgistrar. Intente de nuevo';
        this.showAlert(message);
    }
    );
  }

  private showAlert(message: string){
    this.alertCtrl.create({header: 'Registro Fallido', message: message, buttons: ['Aceptar']}).then(alertEl => alertEl.present());
  }

}
