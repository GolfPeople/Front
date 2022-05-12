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
  posts: PostsResponse[];
  location: string;

  constructor(
    private postsSvc: PostsService,
    private userSvc: UserService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      cssClass: 'laoding-ctrl',
      spinner: 'crescent',
    });
    await loading.present();
    // this.userSvc.getUserInfo().subscribe((user) => {
    //   this.avatarImage = user.profile.photo;
    //   this.userName = user.name;
    // });
    this.postsSvc.getPosts().subscribe((data) => {
      this.posts = data.reverse();
      if (this.posts.length === 0) {
        return;
      }
      console.log(this.posts);

      loading.dismiss();
    });
    // this.postsSvc.posts$.subscribe((posts) => {
    //   this.posts = posts.reverse();
    //   loading.dismiss();
    //   console.log(this.posts);
    // });
  }
}
