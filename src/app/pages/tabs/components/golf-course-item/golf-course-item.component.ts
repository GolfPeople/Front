import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from 'src/app/core/services/game.service';
import { CampusDataService } from '../../pages/campus/services/campus-data.service';

@Component({
  selector: 'app-golf-course-item',
  templateUrl: './golf-course-item.component.html',
  styleUrls: ['./golf-course-item.component.scss'],
})
export class GolfCourseItemComponent implements OnInit {

  @Input() coursesPlayed;

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goToCourseDetail(id) {
    this.router.navigateByUrl('/tabs/campus/campus-detail/' + id);
  }

}
