import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.page.html',
  styleUrls: ['./all-posts.page.scss'],
})
export class AllPostsPage implements OnInit {
  posts: PostsResponse[] = [];
  page = 1;
  isLoadingMore: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private postsSvc: PostsService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'loading-ctrl',
    });
    await loading.present();

    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {
        this.posts = data.filter((item) => item.files.length);
        console.log(this.posts);
        this.page += 1;
        loading.dismiss();
      },
      (error) => {
        loading.dismiss();
        console.log(error);
      }
    );
  }

  onLoadMore() {
    this.isLoadingMore = true;
    this.postsSvc.all(this.page).subscribe(
      ({ data }) => {
        this.posts = this.posts.concat(
          data.filter((item) => item.files.length)
        );
        this.isLoadingMore = false;
        if (data.length) {
          this.page += 1;
        }
      },
      (error) => {
        this.isLoadingMore = false;
        console.log(error);
      }
    );
  }
}
