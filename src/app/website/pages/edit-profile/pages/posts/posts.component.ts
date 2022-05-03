import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/core/services/posts.service';
import { UserService } from 'src/app/core/services/user.service';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';

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
  des;

  constructor(private postsSvc: PostsService, private userSvc: UserService) {}

  ngOnInit() {
    this.userSvc.getUserInfo().subscribe((user) => {
      this.avatarImage = user.profile.photo;
      this.userName = user.name;
    });
    this.postsSvc.getPosts().subscribe((res) => {
      console.log('REST -->', res);
      this.posts = res;
      console.log('REST -->', this.posts);
    });
  }
}
