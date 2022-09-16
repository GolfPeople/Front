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

    let object = {
      name: this.gameSvc.game.value.name,
      date: this.gameSvc.game.value.date,
      address: this.gameSvc.game.value.address,
      lat: this.gameSvc.game.value.lat,
      long: this.gameSvc.game.value.long,
      courses_id: this.gameSvc.game.value.campus.id,
      users: users,
      hours: this.gameSvc.game.value.hour,
      extra: this.gameSvc.game.value.extra,
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
      this.resetForm();
      console.log(res);
      
    }, error =>{
      this.firebaseSvc.Toast('Ha ocurrido un error, intenta de nuevo');
      loading.dismiss();
    })
  }

  resetForm(){
    this.gameSvc.step$.next(1);
    this.gameSvc.game.next({} as Game);
    this.gameSvc.game.value.extra = [];
    this.gameSvc.game.value.hours = [];   
    this.gameSvc.game.value.reservation = [
      { id: '1', name: 'Buggy', icon: 'assets/icons/buggy.svg', isChecked: false },
      { id: '2', name: 'Palos', icon: 'assets/icons/equipment.svg', isChecked: false },
      { id: '2', name: 'Caddy', icon: 'assets/icons/caddy.svg', isChecked: false },
    ];
  }

//  async removePlayers() {


//     let data = {
//       user_id: JSON.parse(localStorage.getItem('user_id'))
//     }
  
//     const loading = await this.firebaseSvc.loader().create();
//     await loading.present();
//     this.gameSvc.removePlayersFromGame(this.game.id, data).subscribe(res => {
     
//       loading.dismiss();
//     }, err => {
//       loading.dismiss();
//       console.log(err);
      
//       this.firebaseSvc.Toast('Ha ocurrido un error, inténtalo de nuevo.')

//     })
//   }

  activityNotification(user_id){
    let activity = {id: user_id.toString(), user_id: user_id, notification: true}
    this.firebaseSvc.addToCollectionById('activity', activity);
  }

}
