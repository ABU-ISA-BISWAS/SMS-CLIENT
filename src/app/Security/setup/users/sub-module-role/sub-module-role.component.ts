import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AddRoleNewComponent } from '../../role-management/add-role-new/add-role-new.component';

@Component({
  selector: 'app-sub-module-role',
  templateUrl: './sub-module-role.component.html',
  styleUrls: ['./sub-module-role.component.css'],
  standalone: false,
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
  @Output() featureSelected = new EventEmitter<{
    feature: any;
    checked: boolean;
  }>();

  constructor() {}
  ngOnInit() {}

  // ── Existing method (kept as-is) ──────────────────────────
  getSelectedFeature(feature: any, checked: any) {
    this.featureSelected.emit({ feature, checked });
  }

  // ── New helpers used by the redesigned template ───────────

  isGranted(feature: any): boolean {
    return feature.updatedStatus !== undefined
      ? feature.updatedStatus
      : !!feature.isGranted;
  }

  toggle(feature: any) {
    const newVal = !this.isGranted(feature);
    feature.updatedStatus = newVal;
    this.featureSelected.emit({ feature, checked: newVal });
  }

  toggleAll(subModule: any) {
    const granted = this.getGranted(subModule);
    const total = subModule.featureDtosList?.length ?? 0;
    const newVal = granted < total;
    (subModule.featureDtosList || []).forEach((f: any) => {
      f.updatedStatus = newVal;
      this.featureSelected.emit({ feature: f, checked: newVal });
    });
  }

  getGranted(subModule: any): number {
    return (subModule.featureDtosList || []).filter((f: any) =>
      this.isGranted(f),
    ).length;
  }

  getPct(subModule: any): number {
    const total = subModule.featureDtosList?.length ?? 0;
    return total === 0
      ? 0
      : Math.round((this.getGranted(subModule) / total) * 100);
  }

  getColor(pct: number): string {
    if (pct === 0) return '#9aa0bc';
    if (pct === 100) return '#1fc98a';
    if (pct >= 60) return '#4b8df8';
    return '#f0a040';
  }
}
