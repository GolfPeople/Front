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
import { LikesComponent } from './components/likes/likes.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CropperComponent } from './components/cropper/cropper.component';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentResponseComponent } from './components/comment-response/comment-response.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { PublicAvatarComponent } from './components/public-avatar/public-avatar.component';
import { PostsComponent } from './components/posts/posts.component';
import { HeaderComponent } from './components/header/header.component';
import { DesignerAvatarComponent } from './components/designer-avatar/designer-avatar.component';
import { CampoCardComponent } from './components/campo-card/campo-card.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { ProductsComponent } from './components/products/products.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const components = [
  SelectDateComponent,
  StoryCardComponent,
  ProductsComponent,
  PeopleComponent,
  PostComponent,
  PostsComponent,
  AvatarComponent,
  RankingCardComponent,
  SuccessComponent,
  ErrorComponent,
  SearchComponent,
  LikesComponent,
  CropperComponent,
  CommentsComponent,
  CommentResponseComponent,
  NotificationsComponent,
  PublicAvatarComponent,
  HeaderComponent,
  DesignerAvatarComponent,
  CampoCardComponent,
  EventCardComponent
];

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [CropperComponent],
  declarations: [components, JsonToDataPipe],

  imports: [
    CommonModule,
    IonicModule,
    SwiperModule,
    FormsModule,
    RouterModule,
    ImageCropperModule,   
  ],
  exports: [components, JsonToDataPipe],
})
export class SharedModule {}
