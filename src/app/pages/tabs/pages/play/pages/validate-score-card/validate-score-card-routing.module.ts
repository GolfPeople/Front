import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateScoreCardPage } from './validate-score-card.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateScoreCardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateScoreCardPageRoutingModule {}
