import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompleteProfilePage } from './complete-profile.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteProfilePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteProfilePageRoutingModule {}
