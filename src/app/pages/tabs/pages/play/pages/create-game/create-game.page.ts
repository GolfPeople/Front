import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { Campus } from 'src/app/core/models/campus.interface';
import { Game } from 'src/app/core/models/game.model';
import { CampusService } from 'src/app/core/services/campus/campus.service';
import { FriendsService } from 'src/app/core/services/friends.service';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { SelectGolfCourseComponent } from 'src/app/pages/tabs/components/select-golf-course/select-golf-course.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { SelectFriendComponent } from '../../../../components/select-friend/select-friend.component';
import { CampusDataService } from '../../../campus/services/campus-data.service';
import { GuestFormComponent } from '../../components/guest-form/guest-form.component';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.page.html',
  styleUrls: ['./create-game.page.scss'],
})
export class CreateGamePage implements OnInit {

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  players$ = new BehaviorSubject([]);
  date$ = new BehaviorSubject('');
  campusSelected;

  avatar: string = 'assets/img/default-avatar.png';

  campus = [];


  loading: boolean;
  creating: boolean;

  campus_id;
  player_id;

  loadingUsers: boolean;

  user;

  currentDate = '';

  currentUserPlaying: boolean = true;

  searchCourse = '';
  constructor(
    private modalController: ModalController,
    private campusSvc: CampusDataService,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private actRoute: ActivatedRoute,
    private friendsSvc: FriendsService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {

    /**
     * Si el usuario viene desde un campo, se selecciona el campo automaticamente con su id.
     * Si este valor es 'x' entonces el campo no se selecciona.
     */
    if (this.actRoute.snapshot.paramMap.get('id') !== 'x') {
      this.campus_id = JSON.parse(this.actRoute.snapshot.paramMap.get('id'))
    } else {
      this.campus_id = this.actRoute.snapshot.paramMap.get('id')
    }

    /**
     * Si el usuario viene desde el perfil de un amigo, se agrega ese usuario a la partida automaticamente con su id.
     * Si este valor es 'x' entonces no hay jugadores selecciona.
     */
    if (this.actRoute.snapshot.paramMap.get('playerId') !== 'x') {
      this.player_id = JSON.parse(this.actRoute.snapshot.paramMap.get('playerId'))
    } else {
      this.player_id = this.actRoute.snapshot.paramMap.get('playerId')
    }

  }

  ngOnInit() {
    this.getCourses();
    this.creating = false;
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  ionViewWillEnter() {
    this.getUsers();
    this.getCurrentUser();

    this.currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd') + 'T00:00:00';
  }

  getCurrentUser() {
    this.userService.user$.subscribe((data) => {
      this.user = data;
    });
  }

  getUsers() {
    if (this.player_id !== 'x') {
      this.loadingUsers = true;
      this.friendsSvc.search('').subscribe(res => {
        let player = res.data.filter(u => u.id == this.player_id)

        this.loadingUsers = false;
        this.players$.next(player)
      });
    }
  }

  getCourses() {
    this.loading = true;
    this.campusSvc.searchCourses(this.searchCourse).subscribe(res => {

      this.loading = false;
      this.campus = res;
      if (this.campus_id !== 'x') {
        this.campusSelected = this.campus.filter(res => res.id == this.campus_id)[0];
      }

    }, err => {
      console.log(err);

    })
  }

  async createGame() {
    this.gameSvc.game.value.address = this.campusSelected.address;
    this.gameSvc.game.value.lat = this.campusSelected.latitude;
    this.gameSvc.game.value.long = this.campusSelected.longitude;
    this.gameSvc.game.value.date = this.date$.value;
    this.gameSvc.game.value.campus = this.campusSelected;
    this.gameSvc.game.value.campus.hour = [].push(this.gameSvc.game.value.campus.hour);
    this.gameSvc.game.value.campus.day = this.gameSvc.game.value.campus.day;
    this.gameSvc.game.value.campus.services = this.gameSvc.game.value.campus.services;
    this.gameSvc.game.value.users = this.players$.value;
    this.gameSvc.game.value.extra = this.gameSvc.game.value.reservation;
    this.gameSvc.game.value.currentUserPlaying = this.currentUserPlaying;

    this.firebaseSvc.routerLink('/tabs/play/available-hours');
  }

  async selectPlayers() {
    const modal = await this.modalController.create({
      component: SelectFriendComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { usersId: this.players$.value.map(u => { return (u.profile.id) }) }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.players$.value.push(...data.players);
    }
  }

  async selectGolfCourse() {
    const modal = await this.modalController.create({
      component: SelectGolfCourseComponent,
      cssClass: 'fullscreen-modal'
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log(data.course);
    }
  }

  async addGuest() {
    const modal = await this.modalController.create({
      component: GuestFormComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { playersLength: this.players$.value.length }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.gameSvc.game.value.guests.push(data.guest)
    }
  }

  removePlayer(index) {
    this.players$.value.splice(index, 1);
  }
  removeGuest(index) {
    this.gameSvc.game.value.guests.splice(index, 1);
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
