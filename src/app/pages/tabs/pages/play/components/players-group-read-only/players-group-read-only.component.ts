import { Component, Input, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-players-group-read-only',
  templateUrl: './players-group-read-only.component.html',
  styleUrls: ['./players-group-read-only.component.scss'],
})
export class PlayersGroupReadOnlyComponent implements OnInit {

  @Input() user;
  @Input() group: any[];
  @Input() groupNumber: number;


  constructor(public gameSvc: GameService) { }

  ngOnInit() {}

}
