import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/edit-profile/edit-profile.module').then(
            (m) => m.EditProfilePageModule
          ),
      },
      {
        path: 'saved-posts',
        loadChildren: () =>
          import('./pages/saved-posts/saved-posts.module').then(
            (m) => m.SavedPostsPageModule
          ),
      },
      {
        path: 'my-posts',
        loadChildren: () =>
          import('./pages/my-posts/my-posts.module').then(
            (m) => m.MyPostsPageModule
          ),
      },
      {
        path: 'friends',
        loadChildren: () =>
          import('./pages/friends/friends.module').then(
            (m) => m.FriendsPageModule
          ),
      },
      {
        path: 'user-profile/:id',
        loadChildren: () =>
          import('./pages/user-profile/user-profile.module').then(
            (m) => m.UserProfilePageModule
          ),
      },
      {
        path: 'chat-room',
        loadChildren: () => import('./pages/chat-room/chat-room.module').then( m => m.ChatRoomPageModule)
      },


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
