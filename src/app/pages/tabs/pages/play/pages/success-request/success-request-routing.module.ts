import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuccessRequestPage } from './success-request.page';

const routes: Routes = [
  {
    path: '',
    component: SuccessRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuccessRequestPageRoutingModule {}
