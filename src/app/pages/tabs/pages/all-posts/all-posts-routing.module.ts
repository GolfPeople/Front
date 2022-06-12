import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPostsPage } from './all-posts.page';

const routes: Routes = [
  {
    path: '',
    component: AllPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPostsPageRoutingModule {}
