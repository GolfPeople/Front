import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AlertConfirmComponent } from '../alert-confirm/alert-confirm.component';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss'],
})
export class GameItemComponent implements OnInit {

@Input() games;
userGames = [];
  constructor(
    private router: Router,    
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
    ) { }

  ngOnInit() {
    this.userGames = this.games
  }


  
  upcoming(){
    return this.userGames.filter(res => res.status == '1').length;
  }
  inProcess(){
    return this.userGames.filter(res => res.status == '2').length;
  }
  canceled(){
    return this.userGames.filter(res => res.status == '3').length;
  }
  played(){
    return this.userGames.filter(res => res.status == '4').length;
  }

  routerLink(route){
    this.firebaseSvc.routerLink(route)
  }


  share(id) {
    navigator.share({
      title: 'Publicación',
      text: 'Mira este juego',
      url: '/tabs/play/game-detail/' + id,
    });
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
    
    loading.dismiss();
  }, error => {
    this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
    loading.dismiss();
  })
}

/**================================================================== */
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
