import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampusPage } from './campus.page';

const routes: Routes = [
  {
    path: '',
    component: CampusPage,
  },
  {
    path: 'admin-panel/:id',
    loadChildren: () =>  import('./pages/admin-panel/admin-panel.module').then((m) => m.AdminPanelPageModule)
  },
  {
    path: 'campus-detail/:detail',
    loadChildren: () => import('./pages/campus-detail/campus-detail.module').then( m => m.CampusDetailPageModule)
  },
  {
    path: 'hole-detail/:detail',
    loadChildren: () => import('./pages/hole-detail/hole-detail.module').then( m => m.HoleDetailPageModule)
  },
  {
    path: 'admin-request/:detail',
    loadChildren: () => import('./pages/admin-request/admin-request.module').then( m => m.AdminRequestPageModule)
  },



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampusPageRoutingModule {}
