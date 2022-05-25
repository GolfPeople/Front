import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { PublicPostComponent } from './components/public-post/public-post.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
    ],
  },
  {
    path: 'post/:user/:id',
    component: PublicPostComponent,
  },

  {
    path: 'posts/:hashtag',
    loadChildren: () =>
      import('./pages/posts/posts.module').then((m) => m.PostsPageModule),
  },
  {
    path: 'create-post',
    loadChildren: () =>
      import('./pages/create-post/create-post.module').then(
        (m) => m.CreatePostPageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebsiteRoutingModule {}
