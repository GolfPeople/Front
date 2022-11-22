import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/core/services/user.service';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';
import { SaveInfoModalComponent } from '../save-info-modal/save-info-modal.component';
import { LoadingService } from '../../../../../../../../core/services/loading/loading.service';
import { ErrorAlertComponent } from '../error-alert/error-alert.component';

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
    private modalCtrl: ModalController,
    private loadingSvc: LoadingService
  ) {}

  ngOnInit() {
    this.form = this.initForm();

    this.userService.getUserInfo().subscribe((res) => {
      this.id = res.id;
    });
  }

  initForm(): FormGroup {
    return this.fb.group({
      currentPassword: ['', [Validators.minLength(8), Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      passwordConfirmation: [
        '',
        [Validators.minLength(8), Validators.required],
      ],
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
  async errorModal(error) {
    // this.isOpen = true;
    const modal = await this.modalCtrl.create({
      component: ErrorAlertComponent,
      backdropDismiss: true,
      cssClass: 'error-modal',
      componentProps: {
        error,
      },
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

  async onSubmit() {
    // const dto = this.form.value;
    this.loadingSvc.presentLoading();
    const dto = await this.form;
    console.log(dto);
    await this.personalSvg
      .updatePassword(
        dto.controls.currentPassword.value,
        dto.controls.password.value,
        dto.controls.passwordConfirmation.value,
        this.id
      )
      .subscribe(
        (res) => {
          console.log('RES -->', res.message);
          this.loadingSvc.dismissLoading();
          
          if (res.message === 'Contraseña inválida') {
            this.currentPasswordError = 'La contraseña actual es incorrecta';
            console.log(this.currentPasswordError);
            this.errorModal(this.currentPasswordError);
            return;
          }

          this.openModal();
        },
        (err) => {
          console.log(err);
        }
      );
    // if (this.currentPasswordError === 'Contraseña inválida') return;
    // this.openModal();
  }
}
