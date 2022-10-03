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
  selector: 'app-reservation-detail-tournament',
  templateUrl: './reservation-detail-tournament.page.html',
  styleUrls: ['./reservation-detail-tournament.page.scss'],
})
export class ReservationDetailTournamentPage implements OnInit {

  constructor(
  ) { }

  ngOnInit() {

  }
 
}
