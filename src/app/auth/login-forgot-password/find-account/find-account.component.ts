import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-find-account',
  templateUrl: './find-account.component.html',
  styleUrls: ['./find-account.component.css'],
  standalone: false,
})
export class FindAccountComponent implements OnInit {
  @Output() searchObj: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  onBlurSearch(event: any) {
    this.searchObj.emit(event.target.value);
  }
}
