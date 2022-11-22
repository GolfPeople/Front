import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
})
export class TournamentsComponent implements OnInit {

@Input() filteredTournaments;
@Input() toggleUserGames$;
  constructor() { }

  ngOnInit() {}

}
