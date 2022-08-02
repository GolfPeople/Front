import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPanelPage } from './admin-panel.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelPage
  },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelPageRoutingModule {}
