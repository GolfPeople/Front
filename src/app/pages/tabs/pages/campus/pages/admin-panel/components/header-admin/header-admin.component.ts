import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.scss'],
})
export class HeaderAdminComponent implements OnInit {

  @Input() title;
  @Input() image;
  constructor() { }

  ngOnInit() {}

}
