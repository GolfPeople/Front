import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  Chart,
  ChartData,
  ChartOptions,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
} from 'chart.js';

@Component({
  selector: 'app-handicap',
  templateUrl: './handicap.page.html',
  styleUrls: ['./handicap.page.scss'],
})
export class HandicapPage implements OnInit, AfterViewInit {
  //string
  buttonSelect: string = 'hf';
  valueHandicap: number = 9.2;
  titleHandicap: string = 'Handicap <br/> Federativo';

  //chart
  protected chartInstance_h1: Chart | undefined;
  protected chartInstance_h2: Chart | undefined;

  //ViewChild
  @ViewChild('canvas_h1', { static: true }) canvas_h1!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas_h2', { static: true }) canvas_h2!: ElementRef<HTMLCanvasElement>;

  //graphic statidistics circle
  private _data_h1: ChartData = {
    datasets: [{
      backgroundColor: [
        "#e5e5e5",
        "#009dd6",
      ],
      data: [0.2, 9.8]
    }],
  };

  _options_h1: ChartOptions = {
    doughnut: {
      datasets: {
        label: "World Wide Wine Production 2018",
      }
    }
  };

  get options_h1(): ChartOptions {
    return this._options_h1;
  }

  set data_h1(data: ChartData) {
    this._data_h1 = data;

    if (this.chartInstance_h1) {
      this.chartInstance_h1.data = this._data_h1;
      this.chartInstance_h1.update();
    }
  }

  get data_h1(): ChartData {
    return this._data_h1;
  }

  //circle 2
  private _data_h2: ChartData = {
    datasets: [{
      backgroundColor: [
        "#e5e5e5",
        "#009838",
      ],
      data: [0.8, 9.2]
    }]
  };

  _options_h2: ChartOptions = {
    responsive: true,
    doughnut: {
      datasets: {
        label: "World Wide Wine Production 2018"
      }
    }
  };

  get options_h2(): ChartOptions {
    return this._options_h2;
  }

  set data_h2(data: ChartData) {
    this._data_h2 = data;

    if (this.chartInstance_h2) {
      this.chartInstance_h2.data = this._data_h2;
      this.chartInstance_h2.update();
    }
  }

  get data_h2(): ChartData {
    return this._data_h2;
  }

  constructor() { }

  ngOnInit() {
    Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale
    );
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.createChart();
  }

  protected createChart() {
    this.chartInstance_h1 = new Chart(this.canvas_h1.nativeElement, {
      type: 'doughnut',
      data: this.data_h1,
      options: this.options_h1,
    });

    this.chartInstance_h2 = new Chart(this.canvas_h2.nativeElement, {
      type: 'doughnut',
      data: this.data_h2,
      options: this.options_h2,
    });
  }

  updateGraphDataH1(data) {
    console.log('update Graph Data H1', data);

    let _data_h1: ChartData = {
      datasets: [{
        backgroundColor: [
          "#e5e5e5",
          "#078c3d",
        ],
        data: data
      }],
    };

    this._data_h1 = _data_h1;

    if (this.chartInstance_h1) {
      this.chartInstance_h1.data = this._data_h1;
      this.chartInstance_h1.update();
    }

  }

  updateGraphDataH2(data) {
    console.log('update Graph Data H2', data);

    let _data_h2: ChartData = {
      datasets: [{
        backgroundColor: [
          "#009838",
          "#e5e5e5",
        ],
        data: data
      }],
    };

    this._data_h2 = _data_h2;

    if (this.chartInstance_h2) {
      this.chartInstance_h2.data = this._data_h2;
      this.chartInstance_h2.update();
    }

  }

}
