import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stock-exchange',
  templateUrl: './stock-exchange.component.html',
  styleUrls: ['./stock-exchange.component.scss'],
})
export class StockExchangeComponent implements OnInit {

  @Input() exchangeData;
  products = [0,0];

  constructor(private router: Router) { }

  ngOnInit() {
  }


  goToCourseDetail(id) {
    this.router.navigateByUrl('/tabs/campus/campus-detail/' + id);
  }

}
