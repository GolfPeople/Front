import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoreCardPage } from './score-card.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreCardPageRoutingModule {}
