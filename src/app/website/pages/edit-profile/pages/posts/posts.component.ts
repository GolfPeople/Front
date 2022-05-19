import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { Post, PostsResponse } from 'src/app/core/interfaces/interfaces';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  avatarImage: string;
  userName: string;
  posts: PostsResponse[] = [];
  location: string;
  page = 1;

  constructor(
    private postsSvc: PostsService,
    private userSvc: UserService,
    private loadingCtrl: LoadingController
  ) {
    // this.postsSvc.posts$.subscribe((data) => {
    //   // this.posts = data;
    //   this.posts = data.filter((item) => item.files.length > 0);
    //   console.log(this.posts);
    // });
  }

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    // await this.postsSvc.getPosts();
    this.postsSvc.getPosts2(this.page).subscribe((data) => {
      this.posts = data.data.filter((item) => item.files.length);
      console.log(this.posts);
      this.page += 1;
      loading.dismiss();
    });
  }
}
