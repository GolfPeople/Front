import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { SwiperModule } from 'swiper/angular';

import { WebsiteRoutingModule } from './website-routing.module';
import { LayoutComponent } from './components/layout/layout.component';
import { NavComponent } from './components/nav/nav.component';
import { SharedModule } from '../shared/shared.module';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { QrComponent } from './components/qr/qr.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { SuccessComponent } from './components/success/success.component';
import { PublicPostComponent } from './components/public-post/public-post.component';
import { EditPostComponent } from './components/edit-post/edit-post.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

const myComponents = [
  LayoutComponent,
  NavComponent,
  CreatePostComponent,
  QrComponent,
  SuccessComponent,
  CreatePostComponent,
  EditPostComponent,
  PublicPostComponent,
];

@NgModule({
  entryComponents: [
    CreatePostComponent,
    SuccessComponent,
    QrComponent,
    CreatePostComponent,
    EditPostComponent,
  ],
  declarations: myComponents,
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    RouterModule,
    IonicModule,
    SharedModule,
    NgxQRCodeModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    GooglePlaceModule,
  ],
})
export class WebsiteModule {}
