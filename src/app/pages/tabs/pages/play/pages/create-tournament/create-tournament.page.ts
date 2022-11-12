import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { GameService } from 'src/app/core/services/game.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { SelectGolfCourseComponent } from 'src/app/pages/tabs/components/select-golf-course/select-golf-course.component';
import { CampusDataService } from '../../../campus/services/campus-data.service';

@Component({
  selector: 'app-create-tournament',
  templateUrl: './create-tournament.page.html',
  styleUrls: ['./create-tournament.page.scss'],
})
export class CreateTournamentPage implements OnInit {

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  campus = [];
  campusSelected;
  date$ = new BehaviorSubject('');
  creating: boolean;
  loading: boolean;
  currentDate = '';
  campus_id;

  constructor(
    private firebaseSvc: FirebaseService,
    private campusSvc: CampusService,
    private campusSvcData: CampusDataService,
    public gameSvc: GameService,
    private modalController: ModalController,
    private datePipe: DatePipe,
  ) { }

  ngOnInit() {

  }

  selectServices(s) {
    s.isChecked = !s.isChecked
  }


  async submit() {
    this.gameSvc.tournament.value.date = this.date$.value;
    if (!this.gameSvc.tournament.value.price) {
      const modal = await this.modalController.create({
        component: AlertConfirmComponent,
        cssClass: 'alert-confirm',
        componentProps: {
          confirmText: 'Aceptar',
          content: '¿Estas seguro de que las entradas de tu evento serán gratis?'
        }
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      if (data) {
        this.firebaseSvc.routerLink('/tabs/play/tournament-resumen');
      }
    } else {
      this.firebaseSvc.routerLink('/tabs/play/tournament-resumen');
    }
  }

  validator() {
    if (!this.gameSvc.tournament.value.photo) {
      return false
    }
    if (!this.gameSvc.tournament.value.name) {
      return false
    }
    if (!this.gameSvc.tournament.value.owner_name) {
      return false
    }
    if (!this.date$.value) {
      return false
    }
    if (!this.gameSvc.tournament.value.services) {
      return false
    }
    if (!this.gameSvc.tournament.value.description) {
      return false
    }
    if (!this.gameSvc.tournament.value.link) {
      return false
    }
    if (!this.gameSvc.tournament.value.course) {
      return false
    }

    return true;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

    /**
   * The function gets the golf course information from the database and displays it on the page
   */
     getGolfCourse() {
      if (this.campus_id !== 'x') {
        this.campusSvcData.getCourseGames(this.campus_id).subscribe(res => {
          this.campusSelected = res;
        })
      }
    }

      /**
   * It creates a modal, presents it, and then waits for the modal to be dismissed. 
   * 
   * When the modal is dismissed, it checks to see if the modal passed back any data. If it did, it sets
   * the campusSelected variable to the data that was passed back.
   */
  async selectGolfCourse() {
  
    const modal = await this.modalController.create({
      component: SelectGolfCourseComponent,
      cssClass: 'select-course-modal'
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.campusSelected = data.course;
      this.gameSvc.tournament.value.course = data.course;
    }
  }

  ionViewWillEnter() {
    this.getAllCampus();
    this.currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd') + 'T00:00:00';
 
  }

  getAllCampus() {
    this.loading = true;
    this.campusSvc.getAllCampus().subscribe(res => {
      this.loading = false;
      this.campus = res.data;
    })
  }

  async addImages() {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      promptLabelHeader: 'Imagen',
      promptLabelPhoto: 'Selecciona una imagen',
      promptLabelPicture: 'Toma una foto',
      source: CameraSource.Prompt
    });

    this.gameSvc.tournament.value.photo = image.dataUrl;   
  }
}
