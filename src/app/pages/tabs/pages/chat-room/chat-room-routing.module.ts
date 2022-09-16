import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatRoomPage } from './chat-room.page';

const routes: Routes = [
  {
    path: '',
    component: ChatRoomPage
  },   {
    path: 'friends-list/:type',
    loadChildren: () => import('./friends-list/friends-list.module').then( m => m.FriendsListPageModule)
  },
  {
    path: 'messages/:id/:id_msg',
    loadChildren: () => import('./messages/messages.module').then( m => m.MessagesPageModule)
  },
  {
    path: 'group-panel/:id',
    loadChildren: () => import('./group-panel/group-panel.module').then( m => m.GroupPanelPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoomPageRoutingModule {}
