import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CampusDataService } from '../../../services/campus-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Campus } from "src/app/core/models/campus.interface";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { SelectScheduleComponent } from '../components/select-schedule/select-schedule.component';
@Component({
  selector: 'app-description',
  templateUrl: './description.page.html',
  styleUrls: ['./description.page.scss'],
})
export class DescriptionPage implements OnInit {

  id;
  detail;
  courseOptions = [
    { id: 1, name: 'Tienda', isCheked: false },
    { id: 2, name: 'Buggies' },
    { id: 4, name: 'Clases', isCheked: false },
    { id: 3, name: 'Equipamento', isCheked: false },
    { id: 5, name: 'Restaurante', isCheked: false },
    { id: 6, name: 'Entretenimiento', isCheked: false }
  ]

  loading: boolean;

  dayInit;
  dayEnd;
  hourInit;
  hourEnd;

  days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  schedule = [];
  constructor(
    public campusSvc: CampusDataService,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
  }

  async submit() {

    this.detail.titleDesigner = this.detail.designer.title;
    this.detail.photoDesigner = this.detail.designer.url;
    this.detail.nameDesigner = this.detail.designer.name;
    this.detail.yearDesigner = this.detail.designer.year;

    this.loading = true
    this.campusSvc.updateGolfCourse(this.id, this.detail).subscribe(res => {
      this.getGolfCourse();
      this.firebaseSvc.Toast(this.translate.instant('UTILS.saved_success'))
      this.loading = false;
    }, error => {
      this.firebaseSvc.Toast(this.translate.instant('UTILS.error'))
      this.loading = false;
    })
  }

  ionViewWillEnter() {
    this.getGolfCourse();
  }


  selectFeature(c) {
    c.isCheked = !c.isCheked
  }

  newSchedule() {
    this.detail.day = [];
    this.detail.hour = [];

    this.detail.day.push(this.dayInit + ' a ' + this.dayEnd);
    this.detail.hour.push(this.hourInit + '-' + this.hourEnd);

     this.detail.day.map(d => {
      this.detail.hour.map(h => {
        this.schedule.push({day: d, hour:h})
      })
    })
  }

  removeSchedule(index){
    this.detail.day.splice(index, 1)
    this.detail.hour.splice(index, 1)
    this.schedule.splice(index, 1)
  }

  getGolfCourse() {

    this.campusSvc.getData().subscribe(async ({ data }) => {
      this.campusSvc.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];

      if (!this.detail.designer) {
        this.detail.designer = { url: '', name: '', title: '', year: '' };
      } else {
        this.detail.designer = JSON.parse(this.detail.designer);
      }
     
    
      if (!this.detail.hour) {
        this.detail.hour = [];
      } else {
        this.detail.hour = JSON.parse(this.detail.hour);
      }

      if (!this.detail.day) {
        this.detail.day = [];
      } else {
        this.detail.day = JSON.parse(this.detail.day);
      }

      if(this.detail.hour.length){
        this.detail.day.map(d => {
          this.detail.hour.map(h => {
            this.schedule.push({day: d, hour:h})
          })
        })
      }
      
      if (!this.detail.services) {
        this.detail.services = this.courseOptions;
      } else {
        this.detail.services = JSON.parse(this.detail.services);
      }

      console.log(this.detail);

    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }


  // async newSchedule() {
  //   const modal = await this.modalController.create({
  //     component: SelectScheduleComponent,
  //     initialBreakpoint: 0.95,
  //     breakpoints: [0, 0.95]
  //   });

  //   await modal.present();

  //   const { data } = await modal.onWillDismiss();

  //   if (data) {
  //     this.detail.hour.push(data.schedule)
  //   }
  // }

  async addDesignerImage() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: this.translate.instant('UTILS.image'),
      promptLabelPhoto: this.translate.instant('UTILS.choose_image'),
      promptLabelPicture: this.translate.instant('UTILS.take_pic'),
      source: CameraSource.Prompt
    });
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    try {
      this.detail.designer.url = await this.firebaseSvc.uploadPhoto('designer/' + this.id, image.dataUrl);
      loading.dismiss();
    } catch (e) {
      console.log(e);

      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.')
      loading.dismiss();
    }

  }

  validator() {
    if (!this.detail.designer.url || !this.detail.designer.title || !this.detail.designer.name || !this.detail.designer.year) {
      return false;
    }

    return true;
  }
}
