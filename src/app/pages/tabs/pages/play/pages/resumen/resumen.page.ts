import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';

  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.gameSvc.step$.next(2);
  }

  next() {
    if (!this.gameSvc.game.value.skipExtra) {
      this.gameSvc.step$.next(3);
      this.firebaseSvc.routerLink('/tabs/play/payment');
    } else {
      this.gameSvc.step$.next(4);
      this.firebaseSvc.routerLink('/tabs/play/confirmation');
    }

  }

  getHoursTotal() {
    return this.gameSvc.getHoursTotal();
  }

  getExtrasTotal() {
    return this.gameSvc.getExtrasTotal();
  }

  getTotal() {
    return this.gameSvc.getTotal();
  }
}
