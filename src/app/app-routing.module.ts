import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CheckLoginGuard } from './guards/check-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'complete-profile',
    loadChildren: () =>
      import('./complete-profile/complete-profile.module').then(
        (m) => m.CompleteProfilePageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'step1',
    loadChildren: () =>
      import('./profile/step1/step1.module').then((m) => m.Step1PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'step2',
    loadChildren: () =>
      import('./profile/step2/step2.module').then((m) => m.Step2PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'step3',
    loadChildren: () =>
      import('./profile/step3/step3.module').then((m) => m.Step3PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'step4',
    loadChildren: () =>
      import('./profile/step4/step4.module').then((m) => m.Step4PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'step5',
    loadChildren: () =>
      import('./profile/step5/step5.module').then((m) => m.Step5PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'step6',
    loadChildren: () =>
      import('./profile/step6/step6.module').then((m) => m.Step6PageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'website',
    loadChildren: () =>
      import('./website/website.module').then((m) => m.WebsiteModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./pages/create-post/create-post.module').then(m => m.CreatePostPageModule)
  },
  {
    path: 'chat/:id',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
  },
  {
    path: 'personal-chat/:id/:room',
    loadChildren: () => import('./pages/personal-chat/personal-chat.module').then( m => m.PersonalChatPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
