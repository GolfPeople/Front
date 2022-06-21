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

  // @HostListener('window: scroll', [])
  // onWindowScroll(): void {
  //   const yOffSet = window.pageYOffset;
  //   if (
  //     (yOffSet ||
  //       this.document.documentElement.scrollTop ||
  //       this.document.body.scrollTop) > this.showScrollheight
  //   ) {
  //     console.log('Se hizo el scroll');
  //     this.loadingMore = true;
  //   } else if (
  //     (yOffSet ||
  //       this.document.documentElement.scrollTop ||
  //       this.document.body.scrollTop) < this.showScrollheight
  //   ) {
  //     this.loadingMore = false;
  //   }
  // }

  // @HostListener('window: scroll', [])
  // onWindowScroll(): void {
  //   if (
  //     window.innerHeight + window.scrollY >= this.document.body.offsetHeight &&
  //     !this.loadingMore
  //   ) {
  //     console.log('bottom of the page');
  //     this.loadingMore = true;
  //     this.onLoadMore();
  //   }
  // }

  // onScrollDown(): void {
  //   this.onLoadMore();
  //   // if (this.info.next) {
  //   //   this.pageNum++;
  //   //   this.getDataFromService();
  //   // }
  // }
}
