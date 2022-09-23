import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampusDetailPage } from './campus-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CampusDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampusDetailPageRoutingModule {}
