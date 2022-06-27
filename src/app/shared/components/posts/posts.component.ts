import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  Inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { PostsResponse } from 'src/app/core/interfaces/interfaces';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  @ViewChild('list') private list: ElementRef;
  @Input() posts: PostsResponse[];
  @Input() loadingMore: boolean = false;
  @Output() loadMore = new EventEmitter();

  private hideScrollHeight = 200;
  private showScrollheight = 500;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {}

  onLoadMore(event) {
    console.log('cargando más...');
    this.loadMore.emit();
    // if (!this.loadingMore) {
    //   event.target.disableb = true;
    // }

    setTimeout(() => {
      console.log('Done');
      this.loadingMore = false;
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      // if (!this.loadingMore) {
      //   event.target.disabled = true;
      // }
    }, 1500);
  }

  onDelete(e, i) {
    this.posts.splice(i, 1);
  }

  scrollBottom(): void {
    try {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
      console.log('Estás haciendo scroll');
    } catch (err) {}
  }
}
