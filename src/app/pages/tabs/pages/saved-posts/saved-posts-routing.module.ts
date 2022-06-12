import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SavedPostsPage } from './saved-posts.page';

const routes: Routes = [
  {
    path: '',
    component: SavedPostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SavedPostsPageRoutingModule {}
