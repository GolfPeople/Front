import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Options{
  one: string;
  two: string;
}

@Component({
  selector: 'app-toggle-options',
  templateUrl: './toggle-options.component.html',
  styleUrls: ['./toggle-options.component.scss'],
})
export class ToggleOptionsComponent implements OnInit {

  @Input() toggle: BehaviorSubject<boolean>;
  @Input() options = {} as Options;
  @Input() color: string;

  constructor() { }

  ngOnInit() {}



}
