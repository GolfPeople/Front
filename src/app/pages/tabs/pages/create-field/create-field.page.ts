import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { MyValidations } from 'src/app/utils/my-validations';
import { environment } from 'src/environments/environment';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

const URL = `${environment.golfpeopleAPI}/api/campus/create/1`;

@Component({
  selector: 'app-create-field',
  templateUrl: './create-field.page.html',
  styleUrls: ['./create-field.page.scss'],
})
export class CreateFieldPage implements OnInit {
  form: FormGroup;

  // Valores del formulario

  information: FormControl;
  name: FormControl;
  title: FormControl;
  year: FormControl;
  services: string[] = [];
  coords;
  days: string[] = [];
  hours: string[] = [];

  selectedTimes: string[] = [];

  optionButtons = [
    {
      text: 'Tienda',
      selected: false,
    },
    {
      text: 'Buggies',
      selected: false,
    },
    {
      text: 'Equipamiento',
      selected: false,
    },
    {
      text: 'Clases',
      selected: false,
    },
    {
      text: 'Restaurante',
      selected: false,
    },
    {
      text: 'Entretenimiento',
      selected: false,
    },
    {
      text: 'Equipamiento',
      selected: false,
    },
  ];
  designerImage;

  daysA = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  daysB = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  dayA: string = '';
  dayB: string = '';
  timeA: string = '';
  timeB: string = '';

  // Autocomplete address
  userAddress: string | any = '';
  userLatitude: string = '';
  userLongitude: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private geolocationSvg: GeolocationService
  ) {}

  async ngOnInit() {
    // this.form = this.initForm();
    const { information, name, title, year } = this.initForm();
    this.information = information;
    this.name = name;
    this.title = title;
    this.year = year;

    const { latitude, longitude } = await (
      await this.geolocationSvg.currentPosition()
    ).coords;
    this.coords = { latitude, longitude };
  }

  async openModal(message) {
    const modal = await this.modalCtrl.create({
      component: SuccessModalComponent,
      backdropDismiss: false,
      cssClass: 'request-modal',
      componentProps: {
        message,
        route: '/tabs/profile',
      },
    });

    await modal.present();
  }

  initForm(): any {
    // return this.fb.group({
    //   information: ['', [Validators.required]],
    //   name: ['', [Validators.required]],
    //   title: ['', [Validators.required]],
    //   year: ['', [Validators.required]],
    // });
    const information = new FormControl('', {});
    const name = new FormControl('', {});
    const title = new FormControl('', {});
    const year = new FormControl('', MyValidations.year);

    return { information, name, title, year };
  }

  selectService(service) {
    service.selected = !service.selected;
    if (service.selected) {
      this.services.push(service.text);
      console.log('Servicios', this.services);
    } else {
      this.services = this.services.filter((item) => item !== service.text);
      console.log('Servicios', this.services);
    }
  }
  captureImage(image) {
    this.designerImage = image;
    console.log(this.designerImage);
  }

  //Método para implementar google autocomplete
  handleAddressChange(address: any) {
    this.userAddress = address.formatted_address;
    this.userLatitude = address.geometry.location.lat();
    this.userLongitude = address.geometry.location.lng();
    console.log(this.userAddress);
    console.log(this.userLatitude);
    console.log(this.userLongitude);
  }

  showValueA(value) {
    this.timeA = value;

    console.log(this.timeA);
  }
  showValueB(value) {
    this.timeB = value;
  }

  addTime(timeA, timeB, dayA, dayB) {
    if (timeA.length > 0 && timeB.length > 0) {
      const hourA = timeA.split(':')[0];
      const minuteA = timeA.split(':')[1];
      const hourB = timeB.split(':')[0];

      const minuteB = timeB.split(':')[1];

      const hourValueA = this.conditionTimeA(hourA);
      const hourValueB = this.conditionTimeA(hourB);

      const hourSelectedA = `${hourValueA}:${minuteA} ${
        parseInt(hourA) >= 12 ? 'pm' : 'am'
      }`;

      const hourSelectedB = `${hourValueB}:${minuteB} ${
        parseInt(hourB) >= 12 ? 'pm' : 'am'
      }`;

      this.hours.push(`${hourSelectedA} a ${hourSelectedB}`);

      this.days.push(`${dayA} a ${dayB}`);

      this.selectedTimes.push(
        `${dayA} a ${dayB} - ${hourSelectedA} a ${hourSelectedB}`
      );

      this.dayA = '';
      this.dayB = '';
      this.timeA = '';
      this.timeB = '';
    }
  }

  removeTime(i) {
    this.hours.splice(i, 1);
    this.days.splice(i, 1);
    this.selectedTimes.splice(i, 1);
  }

  conditionTimeA(time) {
    let value;
    if (parseInt(time) < 12) return time;
    if (time === '12') return '12';

    if (time === '13') return '01';

    if (time === '14') return '02';

    if (time === '15') return '03';

    if (time === '16') return '04';

    if (time === '17') return '05';

    if (time === '18') return '06';

    if (time === '19') return '07';

    if (time === '20') return '08';

    if (time === '21') return '09';

    if (time === '22') return '10';

    if (time === '23') return '11';

    if (time === '00') return '12';
  }

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    loading.present();
    // const { information, name, title, year } = this.form.value;
    // console.log( this.services, this.day, this.hour, this.designerImage);
    const formData = new FormData();
    formData.append('information', this.information.value);
    this.services.forEach((item) => {
      formData.append('services[]', item);
    });
    formData.append('photo', this.designerImage);
    formData.append('name', this.name.value);
    formData.append('title', this.title.value);
    formData.append('year', this.year.value);
    this.days.forEach((item) => {
      formData.append('day[]', item);
    });
    this.hours.forEach((item) => {
      formData.append('hour[]', item);
    });
    formData.append('lat', this.userLatitude);
    formData.append('long', this.userLongitude);

    formData.append('location', this.userAddress);
    this.http.post(URL, formData).subscribe((res) => {
      console.log(res);
      loading.dismiss();
      this.openModal('Campo creado con éxito');
    });
  }
}
