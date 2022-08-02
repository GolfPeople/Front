import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { GameService } from 'src/app/core/services/game.service';
import { AlertConfirmComponent } from 'src/app/pages/tabs/components/alert-confirm/alert-confirm.component';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.page.html',
  styleUrls: ['./game-detail.page.scss'],
})
export class GameDetailPage implements OnInit {

  game_id;
  type;

  loading: boolean;
  game;
  avatar: string = 'assets/img/default-avatar.png';
  constructor(
    private actRoute: ActivatedRoute,
    public gameSvc: GameService,
    private sanitizer: DomSanitizer,  
    private firebaseSvc: FirebaseService,
    private modalController: ModalController
  ) {
    this.game_id = this.actRoute.snapshot.paramMap.get('id');
    this.type = this.actRoute.snapshot.paramMap.get('type');
  }

  ngOnInit() {
    if (!this.gameSvc.games$.value.length) {
      this.getAllGames();
    } else {
      this.game = this.gameSvc.games$.value.filter(g => g.id == this.game_id)[0];
      console.log(this.game);

    }
  }

  doRefresh(event) {
    setTimeout(() => {
      this.ngOnInit();
      event.target.complete();
    }, 500)
  }

  async wantToJoin() {
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
      this.sendJoinRequest();
    }
  }

  activityNotification(){
    let activity = {id: this.game.owner_id.toString(), user_id: this.game.owner_id, notification: true}
    this.firebaseSvc.addToCollectionById('activity', activity);
  }

  async sendJoinRequest() {
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.joinRequest(this.game.id).subscribe(res => {
      this.activityNotification();
      this.firebaseSvc.routerLink('/tabs/play/success-request');
      loading.dismiss();
    }, error =>{
      console.log(error);
      
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo')
      loading.dismiss();
    })
  }

  getAllGames() {
    if (!this.gameSvc.games$.value.length) {
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
          status: g.status,
          request_users: g.request_users,
          isInvited: (g.users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id')) && u.status == '1').length ? true : false),
          pending: (g.request_users.filter(u => u.user_id == JSON.parse(localStorage.getItem('user_id'))).length ? true : false)
        }
      }))

      this.game = this.gameSvc.games$.value.filter(g => g.id == this.game_id)[0];

    })
  }

  map() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://maps.google.com/maps?q=${this.game.address}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
  }
}
