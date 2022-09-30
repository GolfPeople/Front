import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-player-options',
  templateUrl: './player-options.component.html',
  styleUrls: ['./player-options.component.scss'],
})
export class PlayerOptionsComponent implements OnInit {

  constructor(private popoverController: PopoverController) { }

  ngOnInit() {}

  removePlayer(){
    this.popoverController.dismiss({ remove: true });
  }

  swapPlayer(){
    this.popoverController.dismiss({ swap: true });
  }
}
