import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';
import { GameDetailPage } from './pages/game-detail/game-detail.page';
@Component({
  selector: 'app-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayPage implements OnInit {

  toggleOptionsGameType = { one: 'Partidas', two: 'Torneos' };
  toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
  toggleGameType$ = new BehaviorSubject(false);
  toggleUserGames$ = new BehaviorSubject(false);
  date$ = new BehaviorSubject('')
  games = [];
  filteredGames = [];
  filteredTournaments = [];
  searchResult = '';

  loading: boolean;

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  filterSelected = '0';
  gameFilters = [
    { id: '0', name: 'Todo' },
    { id: '1', name: 'Próximos' },
    { id: '2', name: 'En proceso' },
    { id: '4', name: 'Jugados' },
    { id: '3', name: 'Anulados' }
  ]

  upcoming = [];
  inProccess = [];
  played = [];
  canceled = []

  user
  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    private userService: UserService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getAllGames();
    this.getTournaments();
    this.getCurrentUser();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }

  getCurrentUser(){
    this.userService.user$.subscribe((data) => {
      this.user = data; 
    });
  }

  createNewGame(){
    if(this.user.profile.handicap){
      this.firebaseSvc.routerLink('/tabs/play/create-game/x/x')
    }else{
     this.handicapRequired();
    }

  }


  /**
*===================Handicap Requerido========================
*/
async handicapRequired() {
  const modal = await this.modalController.create({
    component: AlertConfirmComponent,
    cssClass: 'alert-confirm',
    componentProps: {
      confirmText: 'Agregar',
      content: 'Necesitas agregar tu handicap antes de poder crear o participar en una partida.'
    }
  });

  modal.present();

  const { data } = await modal.onWillDismiss();
  if (data) {
   this.firebaseSvc.routerLink('/tabs/profile/edit')
  }
}

  changeLabels() {
    if (!this.toggleGameType$.value) {
      this.toggleOptionsUserGames = { one: 'Partidas', two: 'Mis Partidas' };
    } else {
      this.toggleOptionsUserGames = { one: 'Torneos', two: 'Mis Torneos' };
    }
  }

  async openGameDetail(id) {
    const modal = await this.modalController.create({
      component: GameDetailPage,
      componentProps: { game_id: id },
      cssClass: 'modal-full'
    });

    await modal.present();

  }

  filterGames() {
    if (this.searchResult) {
      this.filterByName();
    } else {
      if (!this.toggleUserGames$.value) {
        this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false);
      } else {
        this.filterByStatus();
      }
    }
  }

  filterByName() {
    if (!this.toggleUserGames$.value) {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == false).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult)
      })
    } else {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true).filter(g => {
        return g.name.toLocaleLowerCase().includes(this.searchResult)
      })
    }
  }

  filterByStatus() {
    if (this.filterSelected !== '0') {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true && g.status == this.filterSelected);
    } else {
      this.filteredGames = this.gameSvc.games$.value.filter(g => g.isMember == true);
    }
  }

  getTournaments() {
    if (!this.filteredTournaments.length) {
      this.loading = true;
    }
    this.gameSvc.getTournaments().subscribe(res => {
      this.loading = false;
      this.filteredTournaments = res.data.reverse();
    })
  }

  getAllGames() {
    if (!this.filteredGames.length) {
      this.loading = true;
    }
    this.gameSvc.getAllGames().subscribe(res => {
      this.loading = false;
      
      this.gameSvc.games$.next(res.data.reverse().map(g => {

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
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
          noColor: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && !u.teeColor).length ? false : true),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status)).length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false),
          validate:(g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status) && u.validate).length ? true : false)
        }
      }).sort(function (a, b) {
        if (parseInt(a.status) > parseInt(b.status)) {
          return 1;
        }
        if (parseInt(a.status) < parseInt(b.status)) {
          return -1;
        }
        return 0;
      })

      )

      this.filterGames();
    })
  }

  filterGamesByCategory(id) {
    this.filterSelected = id;
    this.filterGames();
  }


}
