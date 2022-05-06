import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Output() hashtags = new EventEmitter();
  hashtagsToEmit = [];

  constructor() {}

  ngOnInit() {}

  hashtag(event: Event) {
    const element = event.target as HTMLInputElement;
    const value = element.value;
    const hashtags = value.split(' ');
    this.hashtagsToEmit = [...hashtags];
  }

  emitHashtags() {
    console.log(this.hashtagsToEmit);
    this.hashtags.emit(this.hashtagsToEmit);
  }
}
