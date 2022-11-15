import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameFinishedTournamentPage } from './game-finished-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: GameFinishedTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameFinishedTournamentPageRoutingModule {}
