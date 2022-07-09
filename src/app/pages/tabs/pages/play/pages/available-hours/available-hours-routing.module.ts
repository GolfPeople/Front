import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableHoursPage } from './available-hours.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableHoursPageRoutingModule {}
