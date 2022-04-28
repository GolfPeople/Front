import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NavComponent } from './components/nav/nav.component';
import { SharedModule } from '../shared/shared.module';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { QrComponent } from './components/qr/qr.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

const myComponents = [
  LayoutComponent,
  NavComponent,
  CreatePostComponent,
  QrComponent,
];

@NgModule({
  entryComponents: [CreatePostComponent, QrComponent],
  declarations: myComponents,
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    RouterModule,
    IonicModule,
    SharedModule,
    NgxQRCodeModule,
  ],
})
export class WebsiteModule {}
