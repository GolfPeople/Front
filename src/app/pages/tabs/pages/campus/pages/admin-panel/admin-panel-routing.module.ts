import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminPanelPage } from './admin-panel.page';

const routes: Routes = [
  {
    path: '',
    component: AdminPanelPage
  },   {
    path: 'edit-info',
    loadChildren: () => import('./edit-info/edit-info.module').then( m => m.EditInfoPageModule)
  },
  {
    path: 'description',
    loadChildren: () => import('./description/description.module').then( m => m.DescriptionPageModule)
  },
  {
    path: 'holes',
    loadChildren: () => import('./holes/holes.module').then( m => m.HolesPageModule)
  },
  {
    path: 'reviews',
    loadChildren: () => import('./reviews/reviews.module').then( m => m.ReviewsPageModule)
  },
  {
    path: 'posts',
    loadChildren: () => import('./posts/posts.module').then( m => m.PostsPageModule)
  },
  {
    path: 'members',
    loadChildren: () => import('./members/members.module').then( m => m.MembersPageModule)
  },
  {
    path: 'messages',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPanelPageRoutingModule {}
