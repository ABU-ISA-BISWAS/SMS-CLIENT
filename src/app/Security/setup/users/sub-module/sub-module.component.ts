import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sub-module',
  templateUrl: './sub-module.component.html',
  styleUrls: ['./sub-module.component.css'],
  standalone: false,
})
export class SubModuleComponent implements OnInit {

  private _parent: any;

  @Input() set parent(value: any) {   
    this._parent = value;
  }

  get parent(): any {                 
    return this._parent;
  }

  @Input() subModules: any;

  constructor() {}

  ngOnInit() {}

  getSelectedFeature(feature: { updatedStatus: boolean; featureId: any; }, checked: any) {
    if (this.parent && typeof this.parent.getSelectedFeature === 'function') {
      this.parent.getSelectedFeature(feature, checked);
    }
  }
}
