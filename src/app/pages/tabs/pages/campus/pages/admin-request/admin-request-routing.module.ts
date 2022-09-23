import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminRequestPage } from './admin-request.page';

const routes: Routes = [
  {
    path: '',
    component: AdminRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRequestPageRoutingModule {}
