import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { GameService } from 'src/app/core/services/game.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { GameDetailPage } from '../../pages/game-detail/game-detail.page';
import { PlayPage } from '../../play.page';

@Component({ 
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent implements OnInit {

@Input() filteredTournaments;
@Input() toggleUserGames$;
  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
    private play: PlayPage
  ) { 
    console.log(this.filteredTournaments);
  }

  ngOnInit() {
    console.log(this.filteredTournaments);
  }


  upcoming(){
    return this.filteredTournaments.filter(res => res.status == '1').length;
  }
  inProcess(){
    return this.filteredTournaments.filter(res => res.status == '2').length;
  }
  canceled(){
    return this.filteredTournaments.filter(res => res.status == '3').length;
  }
  played(){
    return this.filteredTournaments.filter(res => res.status == '4').length;
  }

  async openGameDetail(id) {
    const modal = await this.modalController.create({
      component: GameDetailPage,
      componentProps: { tournament_id: id },
      cssClass: 'modal-full'
    });

    await modal.present();

  }

  share(id) {
    navigator.share({
      title: 'Publicación',
      text: 'Mira este juego',
      url: '/tabs/play/game-detail/' + id,
    });
  }





  async wantToJoin(e) {
    
    const modal = await this.modalController.create({
      component: AlertConfirmComponent,
      cssClass: 'alert-confirm',
      componentProps: {
        confirmText: 'Unirme',
        content: '¿Quieres solicitar unirte a esta partida?'
      }
    });

    modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.sendJoinRequest(e);
    }
  }


  async sendJoinRequest(e) {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.joinRequest(e.id).subscribe(res => {
      this.activityNotification(e);
      this.firebaseSvc.routerLink('/tabs/play/success-request');
      loading.dismiss();
    }, error =>{
      console.log(error);
      
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }

  activityNotification(e){
    let activity = {id: e.owner_id.toString(), user_id: e.owner_id, notification: true}
    this.firebaseSvc.addToCollectionById('activity', activity);
  }

  
    /**
* 
* @param e  
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
    this.play.getAllGames();
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
    this.play.getAllGames();
    console.log(res);
    loading.dismiss();
  }, error => {
    console.log(error);
    this.firebaseSvc.Toast('Ha ocurrido un error, intente de nuevo.');
    loading.dismiss();
  })
}
//================================================================


  /**
 *=================== Restaurar partida========================
 * @param tournament_id 
 */
 async confirmRestore(tournament_id) {
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
    this.restoreGame(tournament_id)
  }
}


async restoreGame(tournament_id) {
  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.changeTournamentStatus(tournament_id, 1).subscribe(res => {
    this.firebaseSvc.Toast('El torneo ha sido restaurado');
    this.play.getAllGames();
    loading.dismiss();
  }, error => {
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}

/**
*=================== Anular partida========================
* @param tournament_id 
*/
async confirmCancel(tournament_id) {
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
    this.cancelGame(tournament_id);
  }
}


async cancelGame(tournament_id) {
  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.changeTournamentStatus(tournament_id, 3).subscribe(res => {
    this.firebaseSvc.Toast('El torneo ha sido anulado');
    this.play.getAllGames();
    loading.dismiss();
  }, error => {
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}

/**
 *=================== Borrar partida========================
 * @param tournament_id 
 */

async confirmRemove(tournament_id) {
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
    this.removeGame(tournament_id);
  }
}

async removeGame(tournament_id) {
  const loading = await this.firebaseSvc.loader().create();
  await loading.present();
  this.gameSvc.removeGame(tournament_id).subscribe(res => {
    console.log(res);
    this.firebaseSvc.Toast('El torneo ha sido eliminado');
    this.play.getAllGames();
    loading.dismiss();
  }, error => {
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}

/**================================================================== */

 
}
