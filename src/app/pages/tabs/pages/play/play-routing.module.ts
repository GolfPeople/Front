import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InProccessGuard } from './guards/in-proccess.guard';

import { PlayPage } from './play.page';

const routes: Routes = [
  {
    path: '',
    component: PlayPage
  },
  {
    path: 'create-game',
    loadChildren: () => import('./pages/create-game/create-game.module').then( m => m.CreateGamePageModule)
  },   {
    path: 'available-hours',
    loadChildren: () => import('./pages/available-hours/available-hours.module').then( m => m.AvailableHoursPageModule),canActivate:[InProccessGuard]
  }, 
  {
    path: 'extras',
    loadChildren: () => import('./pages/extras/extras.module').then( m => m.ExtrasPageModule),canActivate:[InProccessGuard]
  },
  {
    path: 'confirmation',
    loadChildren: () => import('./pages/confirmation/confirmation.module').then( m => m.ConfirmationPageModule),canActivate:[InProccessGuard]
  },
  {
    path: 'payment',
    loadChildren: () => import('./pages/payment/payment.module').then( m => m.PaymentPageModule),canActivate:[InProccessGuard]
  },
  {
    path: 'resumen',
    loadChildren: () => import('./pages/resumen/resumen.module').then( m => m.ResumenPageModule),canActivate:[InProccessGuard]
  },
  {
    path: 'game-detail/:id/:type',
    loadChildren: () => import('./pages/game-detail/game-detail.module').then( m => m.GameDetailPageModule)
  },
  {
    path: 'success-request',
    loadChildren: () => import('./pages/success-request/success-request.module').then( m => m.SuccessRequestPageModule)
  },
  {
    path: 'start-game',
    loadChildren: () => import('./pages/start-game/start-game.module').then( m => m.StartGamePageModule)
  },
  {
    path: 'score-card',
    loadChildren: () => import('./pages/score-card/score-card.module').then( m => m.ScoreCardPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayPageRoutingModule {}
