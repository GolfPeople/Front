import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NavComponent } from './components/nav/nav.component';
import { SharedModule } from '../shared/shared.module';
import { CreatePostComponent } from './components/create-post/create-post.component';

const myComponents = [LayoutComponent, NavComponent, CreatePostComponent];

@NgModule({
  entryComponents: [CreatePostComponent],
  declarations: myComponents,
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    RouterModule,
    IonicModule,
    SharedModule,
  ],
})
export class WebsiteModule {}
