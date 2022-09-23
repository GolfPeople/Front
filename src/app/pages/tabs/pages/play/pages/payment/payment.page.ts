import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';
import { UserService } from 'src/app/core/services/user.service';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  user;
  constructor(
    public gameSvc: GameService,
    private firebaseSvc: FirebaseService,
    private userService: UserService   
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  ionViewWillEnter(){
    this.gameSvc.step$.next(3);
  }

  getUserData(){
    this.userService.user$.subscribe((data) => {
      this.user = data;      
    });
  }

  getHoursTotal(){
    return this.gameSvc.getHoursTotal();
  }

  getExtrasTotal(){
    return this.gameSvc.getExtrasTotal();
  }

  getTotal(){
    return this.gameSvc.getTotal();
  }

  next(){    
    this.firebaseSvc.routerLink('/tabs/play/confirmation');
  }
}
