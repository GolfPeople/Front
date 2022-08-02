import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input() yds;
  @Input() detail;
  @Input() hcpHole;
  @Input() parHole;
  @Input() levelRange;
  @Input() reviews;
  constructor() {



  }

  ngOnInit() {
    
  }


  

}
