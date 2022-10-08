import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartTournamentPage } from './start-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: StartTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartTournamentPageRoutingModule {}
