import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss'],
})
export class ClubsComponent implements OnInit {

  @Input() clubsData;

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goToCourseDetail(id) {
    this.router.navigateByUrl('/tabs/campus/campus-detail/' + id);
  }

}
