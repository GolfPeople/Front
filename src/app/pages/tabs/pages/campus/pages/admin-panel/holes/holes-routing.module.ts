import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HolesPage } from './holes.page';

const routes: Routes = [
  {
    path: '',
    component: HolesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolesPageRoutingModule {}
