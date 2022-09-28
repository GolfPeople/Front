import { Component, OnInit, Input } from '@angular/core';
 
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @Input() products: any;
  
  following: boolean = false;
  sentRequest: boolean = false;

  avatarDefault: string = 'assets/img/default-avatar.png';

  constructor() {}

  ngOnInit() {}
 
}
