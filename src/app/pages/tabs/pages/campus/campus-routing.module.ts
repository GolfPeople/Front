import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampusPage } from './campus.page';

const routes: Routes = [
  {
    path: '',
    component: CampusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampusPageRoutingModule {}
