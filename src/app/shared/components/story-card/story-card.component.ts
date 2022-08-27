import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss'],
})
export class StoryCardComponent implements OnInit {

  @Input() course;

  constructor(private router: Router) { }

  ngOnInit() {}


  goToCourse(id){
   this.router.navigateByUrl('/tabs/campus/campus-detail/'+id)
  }
}
