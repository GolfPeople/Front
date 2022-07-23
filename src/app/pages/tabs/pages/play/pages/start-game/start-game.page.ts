import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start-game',
  templateUrl: './start-game.page.html',
  styleUrls: ['./start-game.page.scss'],
})
export class StartGamePage implements OnInit {

  date = Date.now();
  path;
  mode;

  constructor() { }

  ngOnInit() {
  }

}
