import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  avatar: string = 'assets/img/default-avatar.png';
  user;

  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.gameSvc.step$.next(2);
    this.getCurrentUser();
  }

  getCurrentUser(){
    this.userService.user$.subscribe((data) => {
      this.user = data; 
    });
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
