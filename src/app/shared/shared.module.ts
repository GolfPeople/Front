import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectDateComponent } from './select-date/select-date.component';
import { StoryCardComponent } from './components/story-card/story-card.component';
import { PeopleComponent } from './components/people/people.component';
import { PostComponent } from './components/post/post.component';

const components = [
  SelectDateComponent,
  StoryCardComponent,
  PeopleComponent,
  PostComponent,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule],
  exports: [components],
})
export class SharedModule {}
