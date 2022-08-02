import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoleDetailPage } from './hole-detail.page';

const routes: Routes = [
  {
    path: '',
    component: HoleDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoleDetailPageRoutingModule {}
