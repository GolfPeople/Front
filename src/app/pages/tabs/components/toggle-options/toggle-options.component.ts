import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatService } from 'src/app/core/services/chat/chat.service';

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

  constructor(public chatSvc: ChatService) { }

  ngOnInit() {}



}
