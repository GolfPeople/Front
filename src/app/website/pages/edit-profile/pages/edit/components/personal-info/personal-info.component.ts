import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalInfoService } from '../../services/personal-info/personal-info.service';
import { UserService } from '../../../../../../../core/services/user.service';
import { MyValidations } from 'src/app/utils/my-validations';
import { Country } from '../../../../../../../core/models/enums.interface';
import { SaveInfoModalComponent } from '../save-info-modal/save-info-modal.component';
import { LoadingController, ModalController } from '@ionic/angular';
import { LoadingService } from 'src/app/core/services/loading/loading.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  public form: FormGroup;
  id;
  gender;
  countries = Object.keys(Country);
  birthday: string;

  //ngx autocomplete
  title = 'google-places-autocomplete';
  userAddress: string = '';
  userLatitude: string = '';
  userLongitude: string = '';

  genders = [
    {
      value: 1,
      text: 'Femenino',
    },
    {
      value: 2,
      text: 'Masculino',
    },
    {
      value: 3,
      text: 'Prefiero no decirlo',
    },
  ];

  timePlaying = [
    {
      value: 1,
      text: 'Menos de 1 año',
    },
    {
      value: 2,
      text: 'De 3 a 5 años',
    },
    {
      value: 3,
      text: 'De 5 a 10 años',
    },
    {
      value: 4,
      text: 'Más de 10 años',
    },
  ];

  typePlayer = [
    {
      value: 1,
      text: 'Recurrente',
    },
    {
      value: 2,
      text: 'Ocasional',
    },
    {
      value: 3,
      text: 'Diario',
    },
    {
      value: 4,
      text: 'Profesor/Entrenador de Golf',
    },
    {
      value: 5,
      text: 'Profesional del Circuito de Golf',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private personalSvg: PersonalInfoService,
    private userService: UserService,
    private modalCtrl: ModalController,
    private loadingSvc: LoadingService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    // this.loadingSvc.presentLoading();
    this.form = this.initForm();
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    this.userService.getUserInfo().subscribe((res) => {
      this.id = res.id;

      if (res.name) {
        this.form.controls['name'].setValue(res.name);
      }
      if (res.profile.license) {
        this.form.controls['license'].setValue(res.profile.license);
      }
      if (res.email) {
        this.form.controls['email'].setValue(res.email);
      }
      if (res.profile.phone) {
        this.form.controls['phone'].setValue(res.profile.phone);
      }
      if (res.profile.address) {
        // this.form.controls['address'].setValue(res.profile.address);
        this.userAddress = res.profile.address;
      }
      if (res.profile.province) {
        this.form.controls['province'].setValue(res.profile.province);
      }
      if (res.profile.cp) {
        this.form.controls['cp'].setValue(res.profile.cp);
      }
      if (res.profile.country) {
        this.form.controls['country'].setValue(res.profile.country);
      }
      if (res.profile.language) {
        this.form.controls['language'].setValue(res.profile.language);
      }
      if (res.profile.gender) {
        this.form.controls['gender'].setValue(res.profile.gender);
      }
      if (res.profile.birthday) {
        this.form.controls['birthday'].setValue(res.profile.birthday);
      }
      if (res.profile.handicap) {
        this.form.controls['handicap'].setValue(res.profile.handicap);
      }
      if (res.profile.time_playing) {
        this.form.controls['time_playing'].setValue(res.profile.time_playing);
      }
      if (res.profile.type) {
        this.form.controls['type'].setValue(res.profile.type);
      }

      // this.loadingSvc.dismissLoading();
      loading.dismiss();
    });
  }

  initForm(): FormGroup {
    return this.fb.group({
      name: ['', []],
      license: ['', []],
      email: ['', [Validators.email]],
      phone: ['', []],
      address: ['', []],
      province: ['', []],
      cp: ['', []],
      country: ['', []],
      language: ['', []],
      gender: [this.gender, []],
      birthday: [''],
      handicap: [null, [MyValidations.handicap]],
      time_playing: ['', []],
      type: ['', []],
    });
  }

  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
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

  getDate(date) {
    this.birthday = date;
    this.form.controls['birthday'].setValue(date);
  }

  selectGender(event) {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.form.controls['gender'].setValue(value);
  }

  // selectTimePlaying(event) {
  //   const element = event.target as HTMLInputElement;
  //   const value = element.value;
  //   this.form.controls['timePlaying'].setValue(value);
  // }

  selectTypeplayer(event) {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    this.form.controls['type'].setValue(value);
  }

  async onSubmit() {
    try {
      this.form.controls['address'].setValue(this.userAddress);
      const dto = this.form.value;
      console.log(dto);
      this.personalSvg
        .updateInfo(dto, this.id)
        .subscribe((res) => console.log('RES -->', res));
      this.openModal();
    } catch (error) {}
  }
}
