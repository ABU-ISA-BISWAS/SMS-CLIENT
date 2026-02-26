import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.css'],
  standalone: false,
})
export class EditOrganizationComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {}
}
