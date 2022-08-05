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
  constructor(
    public campusSvc: CampusDataService,
    private actRoute: ActivatedRoute,
    private translate: TranslateService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    let golfCourse = this.campusSvc.golfCourses.value.filter(res => res.id == this.id)[0];

    if (golfCourse) {
      this.detail = golfCourse;
      this.detail.designer = JSON.parse(this.detail.designer)
      this.detail.hour = JSON.parse(this.detail.hour);
      this.detail.services = JSON.parse(this.detail.services);   
      if (!this.detail.designer || this.detail.designer == "null") {
        this.detail.designer = { url: '', name: '', title: '', year: '' };
      }
      if (!this.detail.hour || this.detail.hour == "null") {
        this.detail.hour = [];
      }
      if (!this.detail.services || this.detail.services == "null") {
        this.detail.services = this.courseOptions;
      }
    } else {
      this.detail = {} as Campus;
      this.detail.hour = [];
      this.detail.services = this.courseOptions;   
      this.detail.designer = { url: '', name: '', title: '', year: '' };
    }

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

  getGolfCourse() {

    this.campusSvc.getData().subscribe(async ({ data }) => {
      this.campusSvc.golfCourses.next(data.reverse());
      this.detail = data.filter(res => res.id == this.id)[0];
      this.detail.teesList = JSON.parse(this.detail.teesList);
      this.detail.scorecarddetails = JSON.parse(this.detail.scorecarddetails);
      this.detail.hour = JSON.parse(this.detail.hour);
      this.detail.services = JSON.parse(this.detail.services);
      this.detail.designer = JSON.parse(this.detail.designer)
     
      if (!this.detail.designer || this.detail.designer == "null") {
        this.detail.designer = { url: '', name: '', title: '', year: '' };        
      }
      if (!this.detail.hour || this.detail.hour == "null") {
        this.detail.hour = [];
      }
      if (!this.detail.services || this.detail.services == "null") {
        this.detail.services = this.courseOptions;
      }
      

    },
      (error) => {
        console.log('Error -->', error);
      }
    );
  }


  async newSchedule() {
    const modal = await this.modalController.create({
      component: SelectScheduleComponent,
      initialBreakpoint: 0.95,
      breakpoints: [0, 0.95]
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.detail.hour.push(data.schedule)
    }
  }

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
    this.detail.designer.url = await this.firebaseSvc.uploadPhoto('designer/' + this.id, image.dataUrl);
    loading.dismiss();   
  }
}
