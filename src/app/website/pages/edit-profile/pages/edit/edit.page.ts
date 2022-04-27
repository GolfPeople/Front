import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  personalInfo: boolean = true;
  security: boolean = false;
  privacy: boolean = false;

  constructor() {}

  ngOnInit() {}

  selectPage(event: Event) {
    const element = event.target as HTMLElement;
    const value = element.id;
    if (value === '1') {
      this.personalInfo = true;
      this.security = false;
      this.privacy = false;
      return;
    }
    if (value === '2') {
      this.personalInfo = false;
      this.security = true;
      this.privacy = false;
      return;
    }
    if (value === '3') {
      this.personalInfo = false;
      this.security = false;
      this.privacy = true;
      return;
    }
  }
}
