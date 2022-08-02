import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SwiperOptions } from 'swiper';
import { AlertConfirmComponent } from '../../components/alert-confirm/alert-confirm.component';
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
  searchResult = '';

  avatar: string = 'assets/img/default-avatar.png';

  loading: boolean;

  config: SwiperOptions = {
    slidesPerView: 3.5,
    spaceBetween: 10,
  };

  filterSelected = '0';
  gameFilters = [
    { id: '0', name: 'Todo' },
    { id: '1', name: 'Próximos' },
    { id: '2', name: 'Jugados' },
    { id: '3', name: 'Anulados' }
  ]
  constructor(
    public gameSvc: GameService,
    private alertController: AlertController,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.getAllGames();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ionViewWillEnter();
      event.target.complete();
    }, 500)
  }


  /**
 *=================== Restaurar partida========================
 * @param game_id 
 */  
  async confirmRestore(game_id) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Restaurar',
        content: '¿Quieres restaurar esta partida?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.restoreGame(game_id)
    }
  }


  async restoreGame(game_id) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.changeGameStatus(game_id, 1).subscribe(res => {
      this.firebaseSvc.Toast('La partida ha sido restaurada');
      this.getAllGames();
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }

  /**
 *=================== Anular partida========================
 * @param game_id 
 */
  async confirmCancel(game_id) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Anular',
        content: '¿Estás seguro de anular esta partida?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.cancelGame(game_id);
    }
  }

  
  async cancelGame(game_id) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.changeGameStatus(game_id, 3).subscribe(res => {
      this.firebaseSvc.Toast('La partida ha sido anulada');
      this.getAllGames();
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }




  /**
   *=================== Borrar partida========================
   * @param game_id 
   */
 
  async confirmRemove(game_id) {
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Eliminar',
        content: '¿Estás seguro de eliminar esta partida?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.removeGame(game_id);
    }
  }

  async removeGame(game_id) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.removeGame(game_id).subscribe(res => {
      console.log(res);
      this.firebaseSvc.Toast('La partida ha sido eliminada');
      this.getAllGames();
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }

  /**================================================================== */


  filterGames() {
    let games_id = [];
    let exist = this.gameSvc.games$.value.map(g => {
      return (
        g.users.filter(u => u.data.id == JSON.parse(localStorage.getItem('user_id')) && ['2', '4'].includes(u.status))
      )
    })
    if (exist) {
      for (let e of exist) {
        if (e.length > 0) {
          games_id.push(e[0].game_id);
        }
      }
    }

    if (this.searchResult) {

      if (!this.toggleUserGames$.value) {
        this.filteredGames = this.gameSvc.games$.value.filter(g => !games_id.includes(g.id)).filter(g => {
          return g.name.toLocaleLowerCase().includes(this.searchResult)
        })
      } else {
        this.filteredGames = this.gameSvc.games$.value.filter(g => games_id.includes(g.id)).filter(g => {
          return g.name.toLocaleLowerCase().includes(this.searchResult)
        })
      }

    } else {
      if (!this.toggleUserGames$.value) {
        this.filteredGames = this.gameSvc.games$.value.filter(g => !games_id.includes(g.id));
      } else {

        if (this.filterSelected !== '0') {
          this.filteredGames = this.gameSvc.games$.value.filter(g => games_id.includes(g.id) && g.status == this.filterSelected);
        } else {
          this.filteredGames = this.gameSvc.games$.value.filter(g => games_id.includes(g.id));
        }

      }
    }
  }

  share(id) {
    navigator.share({
      title: 'Publicación',
      text: 'Mira este juego',
      url: '/tabs/play/game-detail/' + id,
    });
  }

  getAllGames() {
    if (!this.filteredGames.length) {
      this.loading = true;
    }
    this.gameSvc.getAllGames().subscribe(res => {
      this.loading = false;

      this.gameSvc.games$.next(res.data.reverse().map(g => {

        return {
          address: g.address,
          created_at: g.created_at,
          date: g.date,
          id: g.id,
          lat: g.lat,
          long: g.long,
          name: g.name,
          reserves: g.reserves,
          isOwner: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '4').length ? true : false),
          owner_id: g.users.filter(u => u.status == '4')[0].user_id,
          users: g.users.filter(u => { return ['2', '4'].includes(u.status) }),
          fav: false,
          isMember: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '2').length ? true : false),
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      }))

          
      this.filterGames();
    })
  }

  filterGamesByCategory(id) {
    this.filterSelected = id;
    this.filterGames();
  }

  /**
* 
* @param e 
* @param index 
* Aceptar solicitud de juego. (Usuario que se añadió a una partida)
* ===========================================
*/
  async acceptGameRequest(e) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.acceptOrDeclineGameRequest(2, e.id).subscribe(res => {
      console.log(res);
      this.firebaseSvc.Toast('Solicitud de juego aceptada')
      this.toggleUserGames$.next(true);
      this.getAllGames();
      loading.dismiss();
    }, error => {
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      console.log(error);
      loading.dismiss();
    })
  }


  async declineGameRequest(e) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();
    this.gameSvc.acceptOrDeclineGameRequest(3, e.id).subscribe(res => {
      this.firebaseSvc.Toast('Solicitud de juego rechazada')
      this.getAllGames();
      console.log(res);
      loading.dismiss();
    }, error => {
      console.log(error);
      this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
      loading.dismiss();
    })
  }
  //================================================================
}
