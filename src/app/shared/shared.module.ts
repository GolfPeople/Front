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
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JsonToDataPipe } from './pipes/json-to-data.pipe';

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
  declarations: [components, JsonToDataPipe],

  imports: [CommonModule, IonicModule, SwiperModule, FormsModule, RouterModule],
  exports: [components, JsonToDataPipe],
})
export class SharedModule {}
