import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampusDetailPageRoutingModule } from './campus-detail-routing.module';

import { CampusDetailPage } from './campus-detail.page';
import { ComponentsModule } from 'src/app/pages/tabs/components/components.module';
import { InfoComponent } from './components/info/info.component';
import { PostsComponent } from './components/posts/posts.component';
import { ReviewComponent } from './components/review/review.component';
import { EventsComponent } from './components/events/events.component';
import { NewReviewComponent } from './components/new-review/new-review.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CampusDetailPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    CampusDetailPage, 
    InfoComponent,
    PostsComponent,
    ReviewComponent,
    EventsComponent,
    NewReviewComponent
  ]
})
export class CampusDetailPageModule {}
