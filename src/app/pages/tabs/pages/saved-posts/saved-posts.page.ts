import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import {
  PostResponseData,
  PostsResponse,
} from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-saved-posts',
  templateUrl: './saved-posts.page.html',
  styleUrls: ['./saved-posts.page.scss'],
})
export class SavedPostsPage implements OnInit {
  posts: any;

  constructor(
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private location: Location
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.postsSvc.getSavedPosts().subscribe((data) => {
      this.posts = data.data;
      loading.dismiss();
    });
  }

  back() {
    this.location.back();
  }
}
