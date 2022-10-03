import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationDetailTournamentPage } from './reservation-detail-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationDetailTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationDetailTournamentPageRoutingModule {}
