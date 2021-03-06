import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartEvent,
  ChartOptions,
  ChartType,
  Color,
} from 'chart.js';

import {UserService} from '../../../../../../core/services/user.service'

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent implements OnInit, AfterViewInit {
  cards = [1,2,3]
  name:string;
  license:number;
  public doughnutChartLabels = [
    'Handicap',
    'In-Store Sales',
    'Mail-Order Sales',
  ];
  public doughnutChartData: ChartData<'doughnut'>  = {
    labels: ['Handicap', 'Federativo'],
    datasets: [
      {
        data: [355, 52],
        backgroundColor: ['#009DD6', '#009838'],
        borderColor: '#fff',

      },
    ],
  };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
  };

  public doughnutChartType: ChartType = 'doughnut';

  constructor(private userService:UserService) {

  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.userService.getUserInfo().subscribe(
      (user) => {
        this.name = user.name;
        this.license = user.profile.license;
        console.log('TEST -->', user)
      }
    )
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }
}
