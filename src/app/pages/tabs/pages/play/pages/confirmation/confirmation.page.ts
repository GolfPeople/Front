import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/core/models/game.model';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.page.html',
  styleUrls: ['./confirmation.page.scss'],
})
export class ConfirmationPage implements OnInit {


  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.gameSvc.step$.next(4);
  }

  async done() {

    let users = this.gameSvc.game.value.users.filter(u => { return u.isChecked == true }).map(u => { return (u.id) })
    let hours = this.gameSvc.game.value.hours.filter(u => { return u.isChecked == true }).map(u => { return (u.hour) })
    let extra = this.gameSvc.game.value.extra.filter(u => { return u.isChecked == true }).map(u => { return (u.name) })
    let object = {
      name: this.gameSvc.game.value.name,
      date: this.gameSvc.game.value.date,
      address: this.gameSvc.game.value.address,
      lat: this.gameSvc.game.value.lat,
      long: this.gameSvc.game.value.long,
      courses_id: this.gameSvc.game.value.campus.id,
      users: users,
      hours: hours,
      extra: extra,
      total: this.gameSvc.game.value.total
    }
    
    const loading = await this.firebaseSvc.loader().create();
    await loading.present();

    this.gameSvc.createGame(object).subscribe(res => {
      loading.dismiss();
      users.map(id => {
        this.activityNotification(id);
      })
      this.firebaseSvc.routerLink('tabs/play');
      this.gameSvc.step$.next(1);
      this.gameSvc.game.next({} as Game);
      this.gameSvc.game.value.extra = [];
      this.gameSvc.game.value.hours = [];      
    }, error =>{
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
    })
  }

  activityNotification(user_id){
    let activity = {id: user_id.toString(), user_id: user_id, notification: true}
    this.firebaseSvc.addToCollectionById('activity', activity);
  }

}
