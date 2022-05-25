import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-public-avatar',
  templateUrl: './public-avatar.component.html',
  styleUrls: ['./public-avatar.component.scss'],
})
export class PublicAvatarComponent implements OnInit {
  imageAvatarDefault = 'assets/img/default-avatar.png';

  @Input() imageAvatar: string;

  constructor() {}

  ngOnInit() {}
}
