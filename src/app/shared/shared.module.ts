import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDateComponent } from './select-date/select-date.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { PeopleComponent } from './components/people/people.component';
import { PostComponent } from './components/post/post.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { IonicModule } from '@ionic/angular';
import { RankingCardComponent } from './components/ranking-card/ranking-card.component';

const components = [
  SelectDateComponent,
  StoryCardComponent,
  PeopleComponent,
  PostComponent,
  AvatarComponent,
  RankingCardComponent
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, IonicModule],
  exports: [components],
})
export class SharedModule {}
