import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PostsService } from 'src/app/core/services/posts.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-public-post',
  templateUrl: './public-post.component.html',
  styleUrls: ['./public-post.component.scss'],
})
export class PublicPostComponent implements OnInit {
  user: string;
  productId: string | null;
  description: string;
  ubication;
  files;
  constructor(
    private postsSvc: PostsService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.actRoute.paramMap
      .pipe(
        switchMap((params) => {
          this.productId = params.get('id');
          this.user = params.get('user');
          if (this.productId) {
            return this.postsSvc.getPost(this.productId);
          }
          return null;
        })
      )
      .subscribe((res) => {
        console.log(res);
        this.description = res.description;
        this.ubication = res.ubication;
        this.files = res.files;
      });
  }
}
