import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
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
  services: string[] = [];
  day: any = [];
  hour: any = [];
  photo: Blob;
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = this.initForm();
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

  initForm(): FormGroup {
    return this.fb.group({
      information: ['', [Validators.required]],
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      year: ['', [Validators.required]],
    });
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

  async onSubmit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    loading.present();
    const { information, name, title, year } = this.form.value;
    // console.log( this.services, this.day, this.hour, this.designerImage);
    const formData = new FormData();
    formData.append('information', information);
    this.services.forEach((item) => {
      formData.append('services[]', item);
    });
    formData.append('photo', this.designerImage);
    formData.append('name', name);
    formData.append('title', title);
    formData.append('year', year);
    formData.append('day[]', this.day);
    formData.append('hour[]', this.hour);
    this.http.post(URL, formData).subscribe((res) => {
      console.log(res);
      loading.dismiss();
      this.openModal('Publicación creada con éxito');
    });
  }
}
