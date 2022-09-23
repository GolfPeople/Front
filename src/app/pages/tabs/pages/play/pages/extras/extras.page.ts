import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-extras',
  templateUrl: './extras.page.html',
  styleUrls: ['./extras.page.scss'],
})
export class ExtrasPage implements OnInit {

 
  alter = []

  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService
    ) { }

  ngOnInit() {
    for (let e of this.gameSvc.game.value.campus.services) {
      let counter = 1
      counter++;
      this.alter.push({ name: e, price: 35 + (counter*2), isChecked: false })
    }
  }

  ionViewWillEnter(){
    this.gameSvc.step$.next(1);
  }

  selectExtras(e) {
    e.isChecked = !e.isChecked
    let extras = this.alter.filter(extra => { return extra.isChecked == true });
    this.gameSvc.game.value.extra = extras;
  }

  next() {   
    this.firebaseSvc.routerLink('/tabs/play/resumen');
  }

}
