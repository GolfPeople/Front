import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {
  @Input() image: string;
  @Input() name: string;
  @Input() address: string;
  @Input() handicap: string;

  constructor() {}

  ngOnInit() {}
}
