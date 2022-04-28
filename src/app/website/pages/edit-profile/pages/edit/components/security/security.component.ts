import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';
import { SaveInfoModalComponent } from '../save-info-modal/save-info-modal.component';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  public form: FormGroup;
  id;

  passwordType = 'password';
  passwordType2 = 'password';
  passwordType3 = 'password';
  eye = 'eye';
  eye2 = 'eye';
  eye3 = 'eye';
  isLoading = false;
  currentPasswordError;

  constructor(
    private fb: FormBuilder,
    private personalSvg: PersonalInfoService,
    private userService: UserService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = this.initForm();

    this.userService.getUserInfo().subscribe((res) => {
      this.id = res.id;
    });
  }

  initForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', []],
      password: ['', []],
      passwordConfirmation: ['', []],
    });
  }

  async openModal() {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: SaveInfoModalComponent,
      backdropDismiss: true,
      cssClass: 'request-modal',
      componentProps: {},
    });

    await modal.present();
  }

  togglePasswordMode() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.eye = this.eye === 'eye-off' ? 'eye' : 'eye-off';
  }
  togglePasswordMode2() {
    this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
    this.eye2 = this.eye2 === 'eye-off' ? 'eye' : 'eye-off';
  }
  togglePasswordMode3() {
    this.passwordType3 = this.passwordType3 === 'text' ? 'password' : 'text';
    this.eye3 = this.eye3 === 'eye-off' ? 'eye' : 'eye-off';
  }

  onSubmit() {
    // const dto = this.form.value;
    const dto = this.form;
    console.log(dto);
    this.personalSvg
      .updatePassword(
        dto.controls.currentPassword.value,
        dto.controls.password.value,
        dto.controls.passwordConfirmation.value,
        this.id
      )
      .subscribe((res) => {
        console.log('RES -->', res.message);

        if (res.message === 'Contraseña inválida') {
          this.currentPasswordError = 'Contraseña inválida';
        }
      });
    if (this.currentPasswordError === 'Contraseña inválida' || null) return;
    this.openModal();
  }
}
