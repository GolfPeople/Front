import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProfilePage } from './edit-profile.page';
import { LevelComponent } from './pages/level/level.component';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage,
    children: [],
  },  {
    path: 'edit',
    loadChildren: () => import('./pages/edit/edit.module').then( m => m.EditPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProfilePageRoutingModule {}
