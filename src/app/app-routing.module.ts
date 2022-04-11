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
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
