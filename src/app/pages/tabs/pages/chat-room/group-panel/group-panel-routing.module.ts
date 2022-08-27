import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupPanelPage } from './group-panel.page';

const routes: Routes = [
  {
    path: '',
    component: GroupPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupPanelPageRoutingModule {}
