import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @Input() posts: PostsResponse[];
  @Input() loadingMore: boolean = false;
  @Output() loadMore = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onLoadMore() {
    this.loadMore.emit();
  }
}
