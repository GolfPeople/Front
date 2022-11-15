import { Component, OnInit } from '@angular/core';
import { PlayersGroup } from 'src/app/core/models/players-group.model';
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

  playersGroup = {
    one: [],
    two: [],
    three: [],
    four: [],
    five: [],
    six: [],
    seven: [],
  } as PlayersGroup;


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
    this.getPlayersGroups();
  }

  getCurrentUser(){
    this.userService.user$.subscribe((data) => {
      this.user = data; 
    });
  }

   /**
   * It takes the players array and slices it into 6 arrays of 4 players each
   */
    getPlayersGroups() {
      this.playersGroup.one = this.gameSvc.game.value.users.slice(0, 3);
      this.playersGroup.two = this.gameSvc.game.value.users.slice(3, 7);
      this.playersGroup.three = this.gameSvc.game.value.users.slice(7, 11);
      this.playersGroup.four = this.gameSvc.game.value.users.slice(11, 15);
      this.playersGroup.five = this.gameSvc.game.value.users.slice(15, 19);
      this.playersGroup.six = this.gameSvc.game.value.users.slice(19, 23);
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
