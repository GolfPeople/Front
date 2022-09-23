import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateTournamentPage } from './create-tournament.page';

const routes: Routes = [
  {
    path: '',
    component: CreateTournamentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateTournamentPageRoutingModule {}
