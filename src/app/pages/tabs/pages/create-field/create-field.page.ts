import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { GeolocationService } from 'src/app/core/services/geolocation.service';
import { MyValidations } from 'src/app/utils/my-validations';
import { environment } from 'src/environments/environment';
import { SwiperComponent } from 'swiper/angular';
import { CropperComponent } from './components/cropper/cropper.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

const URL = `${environment.golfpeopleAPI}/api/campus/create/1`;

@Component({
  selector: 'app-create-field',
  templateUrl: './create-field.page.html',
  styleUrls: ['./create-field.page.scss'],
})
export class CreateFieldPage implements OnInit {
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;
  @ViewChild('swiper') swiper: SwiperComponent;

  backgroundImages = [];

  //Crop image
  imageDAtaUrl: any;
  croppedImage: any;

  selectedFiles: FileList;
  blobArrayData: Blob[] = [];
  campusPhoto: Blob;

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
    private geolocationSvg: GeolocationService,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    private campusSvc: CampusService
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
    const year = new FormControl(0, MyValidations.year);

    return { information, name, title, year };
  }

  //Método para remover una imagen selecionada
  removeImage(index) {
    console.log('index -->', index);
    this.backgroundImages.splice(index, 1);
    this.blobArrayData.splice(index, 1);
    this.campusPhoto = null;

    console.log(this.backgroundImages.length, this.blobArrayData.length);
  }

  //Image functions

  async uploadFile(event: Event) {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList = target.files;
    this.selectedFiles = files;
    console.log('selected files -->', this.selectedFiles);
    const filesTobase64 = [];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const base64 = await this.getBase64(file).then();
      filesTobase64.push(base64);
    }

    for (let index = 0; index < filesTobase64.length; index++) {
      const fileBase64 = filesTobase64[index];

      this.backgroundImages.push(fileBase64);
    }

    for (let index = 0; index < files.length; index++) {
      this.blobArrayData.push(files[index]);
      console.log('Archivos seleccionados desde en input', this.blobArrayData);
    }
  }

  async selectImageSource() {
    const buttons = [
      {
        text: 'Tomar foto',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera);
        },
      },
      {
        text: 'Escoger foto',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos);
        },
      },
    ];

    if (!this.platform.is('hybrid')) {
      buttons.push({
        text: 'Escoger archivo',
        icon: 'attach',
        handler: () => {
          this.fileInput.nativeElement.click();
        },
      });
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Seleciona la fuente',
      buttons,
    });
    await actionSheet.present();
  }

  //Métod para agregar una imagen al arreglo para enviar
  async addImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 30,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source,
    });
    const imageDataUrl = await image.dataUrl;
    this.imageDAtaUrl = await imageDataUrl;

    const croppperModal = await this.modalCtrl.create({
      component: CropperComponent,
      componentProps: {
        imageBase64: imageDataUrl,
      },
    });
    croppperModal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log('Cropper test -->', data);
        this.croppedImage = data.data;
        this.backgroundImages.push(this.croppedImage);
        // console.log(this.backgroundImages);
        const blobData = this.b64toBlob(
          this.croppedImage,
          `image/${image.format}`
        );
        this.campusPhoto = blobData;
        this.blobArrayData.push(blobData);
      }
    });
    await croppperModal.present();
  }

  async presentCropper(imageBase64) {
    const modal = await this.modalCtrl.create({
      component: CropperComponent,
      componentProps: {
        imageBase64,
      },
    });
    modal.onDidDismiss().then((data) => {
      this.croppedImage = data.data;
      console.log('image cropped', this.croppedImage);
    });
    return await modal.present();
  }

  //Convierte un base 64 en un BLOB
  b64toBlob(base64, contentType = '', sliceSize = 512) {
    const base64String = base64.replace('data:image/png;base64,', '');
    const byteCharacters = atob(base64String);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  //Convierte un BLOB en BASE64
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  //Captura el BASE64 de un archivo
  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
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
    formData.append(
      'photo',
      this.designerImage,
      `${this.designerImage.size}${new Date().getTime()}`
    );
    formData.append(
      'photoCampus',
      this.campusPhoto,
      `${this.campusPhoto.size}${new Date().getTime()}`
    );
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

    this.campusSvc.createCamp(
      this.information.value,
      this.services,
      this.designerImage,
      this.campusPhoto,
      this.name.value,
      this.title.value,
      this.year.value,
      this.days,
      this.hours,
      this.userLatitude,
      this.userLongitude,
      this.userAddress
    );
  }
}
