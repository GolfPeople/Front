import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationTournamentPage } from './reservation-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationTournamentPageRoutingModule {}
