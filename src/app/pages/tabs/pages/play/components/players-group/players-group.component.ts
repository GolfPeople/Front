import { Component, Input, OnInit } from '@angular/core';
import { CreateGamePage } from '../../pages/create-game/create-game.page';

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
  @Input() onlyRead: boolean;

  constructor(public createGame: CreateGamePage) { }

  ngOnInit() {}


  removePlayer(userId){
    this.createGame.removePlayer(userId)
 
  }
  
}

