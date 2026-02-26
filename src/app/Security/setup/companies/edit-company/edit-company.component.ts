import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css'],
  standalone: false,
})
export class EditCompanyComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
