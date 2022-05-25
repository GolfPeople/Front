import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserProfilePageRoutingModule } from './user-profile-routing.module';

import { UserProfilePage } from './user-profile.page';
import { LevelComponent } from './components/level/level.component';
import { PostsComponent } from './components/posts/posts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SwiperModule } from 'swiper/angular';

const components = [LevelComponent, PostsComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserProfilePageRoutingModule,
    SharedModule,
    SwiperModule,
  ],
  declarations: [UserProfilePage, components],
})
export class UserProfilePageModule {}
