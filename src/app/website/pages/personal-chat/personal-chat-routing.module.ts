import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonalChatPage } from './personal-chat.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalChatPageRoutingModule {}
