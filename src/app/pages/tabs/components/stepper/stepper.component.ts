import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/core/services/game.service';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {

  constructor(public gameSvc: GameService) { }

  ngOnInit() {}

}
