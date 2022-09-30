import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { CreateGamePage } from '../../pages/create-game/create-game.page';
import { PlayerOptionsComponent } from '../player-options/player-options.component';

@Component({
  selector: 'app-players-group',
  templateUrl: './players-group.component.html',
  styleUrls: ['./players-group.component.scss'],
})
export class PlayersGroupComponent implements OnInit {

  @Input() group: any[];
  @Input() groupNumber: number;
  @Input() user: any;
  @Input() currentUserPlaying: boolean;

  playerToSwapId;

  constructor(
    public createGame: CreateGamePage,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {

  }


  removePlayer(userId) {
    this.createGame.removePlayer(userId)
  }

  swapPlayer(userIdTo) {
   this.createGame.filterToSwapPlayers(this.createGame.playerToSwapId, userIdTo)
  }


  async playerOptions(ev: any, userId) {
    const popover = await this.popoverController.create({
      component: PlayerOptionsComponent,
      event: ev,
      translucent: false
    });

    popover.present();

    const { data } = await popover.onWillDismiss();

   

    if (data && data.remove) {
      this.removePlayer(userId)
    }

    if (data && data.swap) {
      this.createGame.swapActive = true;
    
      this.createGame.playerToSwapId = userId;

      
    }
  }



}

