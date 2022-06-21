import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
})
export class MyPostsPage implements OnInit {
  posts: PostsResponse[] = [];
  page = 1;
  isLoadingMore: boolean = false;

  constructor(
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private location: Location
  ) {
    // this.postsSvc.posts$.subscribe((data) => {
    //   this.posts = data.filter((item) => item.files.length);
    //   console.log(data);
    // });
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();
    this.postsSvc.myPosts(this.page).subscribe(({ data }) => {
      this.posts = data.filter((item) => item.files.length);
      this.page = this.page + 1;
      console.log(data);
      loading.dismiss();
    });
  }

  back() {
    this.location.back();
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.postsSvc.myPosts(this.page).subscribe(
      ({ data }) => {
        this.posts = this.posts.concat(
          data.filter((item) => item.files.length)
        );
        this.isLoadingMore = false;
        this.page += 1;
      },
      (error) => {
        this.isLoadingMore = false;
        console.log(error);
      }
    );
  }
}
