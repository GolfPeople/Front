import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GameFinishedSuccessPage } from './game-finished-success.page';

const routes: Routes = [
  {
    path: '',
    component: GameFinishedSuccessPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameFinishedSuccessPageRoutingModule {}
