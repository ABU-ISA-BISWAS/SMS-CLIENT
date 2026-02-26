import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddRoleNewComponent } from '../../role-management/add-role-new/add-role-new.component';

@Component({
  selector: 'app-sub-module-role',
  templateUrl: './sub-module-role.component.html',
  styleUrls: ['./sub-module-role.component.css'],
  standalone: false
})
export class SubModuleRoleComponent implements OnInit {
  private _parent!: AddRoleNewComponent;

  @Input() set parent(value: AddRoleNewComponent) {
    this._parent = value;
  }
  get parent(): AddRoleNewComponent {
    return this._parent;
  }

  @Input() subModules: any;

  @Output() featureSelected = new EventEmitter<{ feature: any; checked: boolean }>();

  constructor() {}

  ngOnInit() {}

  getSelectedFeature(feature: any, checked: any) {
    this.featureSelected.emit({ feature, checked });
  }
}
