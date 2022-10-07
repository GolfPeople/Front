import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateScoreCardTournamentPage } from './validate-score-card-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateScoreCardTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateScoreCardTournamentPageRoutingModule {}
