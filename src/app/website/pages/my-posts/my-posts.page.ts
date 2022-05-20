import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
})
export class MyPostsPage implements OnInit {
  posts: PostsResponse[] = [];

  constructor(
    private postsSvc: PostsService,

    private location: Location
  ) {
    this.postsSvc.posts$.subscribe((data) => {
      this.posts = data.filter((item) => item.files.length);
      console.log(data);
    });
  }

  ngOnInit() {
    this.postsSvc.getPosts();
  }

  back() {
    this.location.back();
  }
}
