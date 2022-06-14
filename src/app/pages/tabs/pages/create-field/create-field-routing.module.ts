import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateFieldPage } from './create-field.page';

const routes: Routes = [
  {
    path: '',
    component: CreateFieldPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateFieldPageRoutingModule {}
