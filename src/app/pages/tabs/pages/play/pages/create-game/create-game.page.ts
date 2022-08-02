import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Campus } from 'src/app/core/models/campus.interface';
import { Game } from 'src/app/core/models/game.model';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SelectFriendComponent } from '../../../../components/select-friend/select-friend.component';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.page.html',
  styleUrls: ['./create-game.page.scss'],
})
export class CreateGamePage implements OnInit {

  players$ = new BehaviorSubject([]);
  date$ = new BehaviorSubject('');
  campusSelected: Campus;

  avatar: string = 'assets/img/default-avatar.png';

  campus = [];


  loading: boolean;
  creating: boolean;

  campus_id;
  constructor(
    private modalController: ModalController,
    private campusSvc: CampusService,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,  
    private actRoute: ActivatedRoute
  ) { 
    if(this.actRoute.snapshot.paramMap.get('id') !== 'x'){
      this.campus_id = JSON.parse(this.actRoute.snapshot.paramMap.get('id'))
    }
    
  }

  ngOnInit() { 
    this.getAllCampus();
    this.creating = false;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  getAllCampus() {
    this.loading = true;
    this.campusSvc.getAllCampus().subscribe(res => {
      this.loading = false;
       
      this.campus = res.data;   
      if(this.campus_id !== 'x'){
          this.campusSelected = this.campus.filter(res => res.id == this.campus_id)[0];                 
      }    
    
    })
  }

  async createGame() {
    this.gameSvc.game.value.address = this.campusSelected.location;
    this.gameSvc.game.value.lat = this.campusSelected.lat;
    this.gameSvc.game.value.long = this.campusSelected.long;
    this.gameSvc.game.value.date = this.date$.value;
    this.gameSvc.game.value.campus = this.campusSelected;
    this.gameSvc.game.value.campus.hour = this.gameSvc.game.value.campus.hour;  
    this.gameSvc.game.value.campus.day = this.gameSvc.game.value.campus.day;
    this.gameSvc.game.value.campus.services = this.gameSvc.game.value.campus.services;
    this.gameSvc.game.value.users = this.players$.value;
   
    this.firebaseSvc.routerLink('/tabs/play/available-hours');    
  }

  async selectPlayers() {
    const modal = await this.modalController.create({
      component: SelectFriendComponent,
      cssClass: 'fullscreen-modal'
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.players$.next(data.players)
    }
  }

  validator() {
    if (this.players$.value.length == 0) {
      return false;
    }
    if (!this.date$.value) {
      return false;
    }
    if (!this.campusSelected) {
      return false;
    }
    if (!this.gameSvc.game.value.name) {
      return false;
    }

    return true;
  }
}
