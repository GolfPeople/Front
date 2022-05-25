import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';
import { PostsService } from 'src/app/core/services/posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: PostsResponse[] = [];
  page = 1;
  id;

  constructor(
    private postsSvc: PostsService,
    private loadingCtrl: LoadingController,
    private actRoute: ActivatedRoute
  ) {
    // this.postsSvc.posts$.subscribe((data) => {
    //   // this.posts = data;
    //   this.posts = data.filter((item) => item.files.length > 0);
    //   console.log(this.posts);
    // });
  }

  ngOnInit() {
    this.actRoute.paramMap
      .pipe(
        switchMap((param) => {
          this.id = param.get('id');

          if (this.id) {
            return this.postsSvc.getPostsByUser(this.id, this.page);
          }
          return null;
        })
      )
      .subscribe((res) => {
        this.posts = res.data.filter((item) => item.files.length);
        this.page += 1;
      });
  }
}
