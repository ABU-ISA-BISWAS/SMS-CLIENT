import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.css'],
  standalone: false,
})
export class SelectUserComponent implements OnInit {
  @Input() userList: any[] = [];

  @Output() selectedUser: EventEmitter<object> = new EventEmitter<object>();

  constructor() {}

  ngOnInit() {}

  onClickUser(user: any) {
    this.selectedUser.emit(user);
  }
}
