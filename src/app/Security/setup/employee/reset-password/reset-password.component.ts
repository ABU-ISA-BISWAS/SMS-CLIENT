import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
     standalone: false,
  
})
export class ResetPasswordComponent implements OnInit {

  constructor(public bsModalRef:BsModalRef) { }

  ngOnInit() {
  }

}
