import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoreCardTournamentPage } from './score-card-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreCardTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreCardTournamentPageRoutingModule {}
