import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TournamentResumenPage } from './tournament-resumen.page';

const routes: Routes = [
  {
    path: '',
    component: TournamentResumenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TournamentResumenPageRoutingModule {}
