import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NavComponent } from './components/nav/nav.component';

const myComponents = [LayoutComponent, NavComponent];

@NgModule({
  declarations: myComponents,
  imports: [CommonModule, WebsiteRoutingModule, RouterModule, IonicModule],
})
export class WebsiteModule {}
