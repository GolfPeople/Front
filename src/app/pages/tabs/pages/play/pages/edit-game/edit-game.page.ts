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
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { SelectFriendComponent } from '../../../../components/select-friend/select-friend.component';


@Component({
  selector: 'app-edit-game',
  templateUrl: './edit-game.page.html',
  styleUrls: ['./edit-game.page.scss'],
})
export class EditGamePage implements OnInit {

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
  loadingUsers: boolean;

  user;

  currentDate = '';
  game_id: number;
  game;
  hour = '';
  name = '';
  reservation = [];

  updating: boolean;
  constructor(
    private modalController: ModalController,
    private campusSvc: CampusService,
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private actRoute: ActivatedRoute,
    private friendsSvc: FriendsService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {

    this.game_id = JSON.parse(this.actRoute.snapshot.paramMap.get('id'))
  }

  ngOnInit() {

  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  ionViewWillEnter() {
    this.getCurrentUser();
    this.getGame();
    this.currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd') + 'T00:00:00';
  }

  getCurrentUser() {
    this.userService.user$.subscribe((data) => {
      this.user = data;
    });
  }

  getGame() {
    this.loading = true;
    this.gameSvc.getAllGames().subscribe(res => {
      this.loading = false;

      let games = res.data.map(g => {

        return {
          game_init: g.game_init,
          address: g.address,
          created_at: g.created_at,
          campuses_id: g.campuses_id,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          reserves: g.reserves,
          isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
          owner_id: g.users.filter(u => u.status == '4')[0].user_id,
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) && u.data.id !== parseInt(localStorage.getItem('user_id')) }),
          noColor: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && !u.teeColor).length ? false : true),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      })

      this.game = games.filter(g => g.id == this.game_id)[0];

      this.date$.next(this.game.date)
      this.name = this.game.name;
      this.hour = JSON.parse(this.game.reserves[0].hours)
      this.reservation = JSON.parse(this.game.reserves[0].extra)
      
      console.log(this.game);
      
      this.getAllCampus();
    })
  }

  getAllCampus() {
    this.loading = true;
    this.campusSvc.getAllCampus().subscribe(res => {
      this.loading = false;

      this.campus = res.data;

      this.campusSelected = this.campus.filter(res => res.id == this.game.campuses_id)[0];

    })
  }



  updateGame() {
    let data = {
      name: this.name,
      date: this.date$.value,
      address: this.campusSelected.address,
      campuses_id: this.campusSelected.id,
      lat: this.campusSelected.latitude,
      long: this.campusSelected.longitude
    }
    
    this.updating = true;
 
    this.gameSvc.updateGame(this.game.id, data).subscribe(res => {
      
      this.updating = false;
      this.firebaseSvc.Toast('Actualizado exitosamente');
      this.firebaseSvc.routerLink('/tabs/play');
    }, error => {
      this.updating = false;
      console.log(error);
      
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo.')
    })
  }


  


  async selectPlayers() {
    const modal = await this.modalController.create({
      component: SelectFriendComponent,
      cssClass: 'fullscreen-modal',
      componentProps: { usersId: this.game.users.map(u => { return (u.data.id) }) }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
     this.addPlayers(data.players)
    }
  }

  addPlayers(users) {
    let data = {
      users: users.map(u => { return (u.id) })
    }
    
    this.updating = true;
    this.gameSvc.addPlayersToGame(this.game.id, data).subscribe(res => {
      this.firebaseSvc.Toast('Se ha enviado invitación a los jugadores agregados');
      this.getGame();
      this.updating = false;
    }, err => {
      this.updating = false;
      console.log(err);
      
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo.')

    })
  }


  async confirmDeletePlayer(player_id) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Eliminar',
        content: '¿Quieres eliminar a este jugador?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
     this.removePlayers(player_id)
    }
  }

  removePlayers(player_id) {


    let data = {
      user_id: player_id
    }
  
    this.updating = true;
    this.gameSvc.removePlayersFromGame(this.game.id, data).subscribe(res => {
      this.firebaseSvc.Toast('Jugador eliminado de la partida');
      this.getGame();
      this.updating = false;
    }, err => {
      this.updating = false;
      console.log(err);
      
      this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo.')

    })
  }

  validator() {
    if (!this.game.users.length) {
      return false;
    }
    if (!this.date$.value) {
      return false;
    }
    if (!this.campusSelected) {
      return false;
    }
    if (!this.name) {
      return false;
    }

    return true;
  }
}
