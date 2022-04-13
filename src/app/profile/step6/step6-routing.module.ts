import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Step6Page } from './step6.page';

const routes: Routes = [
  {
    path: '',
    component: Step6Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Step6PageRoutingModule {}
