import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDateComponent } from './select-date/select-date.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { PeopleComponent } from './components/people/people.component';
import { PostComponent } from './components/post/post.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { IonicModule } from '@ionic/angular';
import { RankingCardComponent } from './components/ranking-card/ranking-card.component';
import { SuccessComponent } from './alerts/success/success.component';
import { ErrorComponent } from './alerts/error/error.component';

import { SwiperModule } from 'swiper/angular';
import { SearchComponent } from './components/search/search.component';

const components = [
  SelectDateComponent,
  StoryCardComponent,
  PeopleComponent,
  PostComponent,
  AvatarComponent,
  RankingCardComponent,
  SuccessComponent,
  ErrorComponent,
  SearchComponent,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, IonicModule, SwiperModule],
  exports: [components],
})
export class SharedModule {}
