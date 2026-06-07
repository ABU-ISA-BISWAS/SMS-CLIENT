import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-features-modal',
  templateUrl: './role-features-modal.component.html',
  styleUrls: ['./role-features-modal.component.css'],
  standalone: false,
})
export class RoleFeaturesModalComponent implements OnInit {
  title!: string;
  features: any[] = [];
  roleNo!: number;
  roleName!: string;

  searchText: string = '';
  filteredFeatures: any[] = [];
  changedFeatures: any[] = [];

  public onClose!: Subject<any>;

  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit() {
    this.onClose = new Subject();

    if (!this.features) {
      this.features = [];
    }

    // Normalise activeStatus to boolean for [(ngModel)] on checkboxes
    this.features = this.features.map((feature) => ({
      ...feature,
      activeStatus: this.toBoolean(feature.activeStatus),
    }));

    this.filteredFeatures = [...this.features];
  }

  // ── Computed stat ──────────────────────────────────────────
  get activeCount(): number {
    return this.features.filter((f) => f.activeStatus).length;
  }

  // ── Search fix: filter against this.features (source of truth) ─
  filterFeatures() {
    const term = this.searchText.trim().toLowerCase();

    if (!term) {
      this.filteredFeatures = [...this.features];
      return;
    }

    this.filteredFeatures = this.features.filter(
      (feature) =>
        (feature.menuName && feature.menuName.toLowerCase().includes(term)) ||
        (feature.submenuName &&
          feature.submenuName.toLowerCase().includes(term)) ||
        (feature.typeName && feature.typeName.toLowerCase().includes(term)) ||
        (feature.roleName && feature.roleName.toLowerCase().includes(term)) ||
        (feature.accessType && feature.accessType.toLowerCase().includes(term)),
    );
  }

  clearSearch() {
    this.searchText = '';
    this.filteredFeatures = [...this.features];
  }

  // ── Track changed rows ─────────────────────────────────────
  isChanged(feature: any): boolean {
    return this.changedFeatures.some((f) => f.featureId === feature.featureId);
  }

  onStatusChange(feature: any) {
    // featureId as unique key (fallback to submenuNo)
    const key = feature.featureId ?? feature.submenuNo;
    const existing = this.changedFeatures.find(
      (f) => (f.featureId ?? f.submenuNo) === key,
    );

    const payload = {
      submenuNo: feature.submenuNo,
      featureId: feature.featureId,
      roleNo: feature.roleNo,
      roleName: feature.roleName,
      accessType: feature.accessType,
      typeName: feature.typeName,
      submenuName: feature.submenuName,
      menuName: feature.menuName,
      activeStatus: feature.activeStatus ? 1 : 0,
    };

    if (existing) {
      existing.activeStatus = payload.activeStatus;
    } else {
      this.changedFeatures.push(payload);
    }

    // Mirror change back to source array so stats stay accurate
    const src = this.features.find((f) => (f.featureId ?? f.submenuNo) === key);
    if (src) src.activeStatus = feature.activeStatus;

    console.log('Changed Features →', this.changedFeatures);
  }

  onCloseModal() {
    this.onClose.next({
      roleNo: this.roleNo,
      changedFeatures: this.changedFeatures,
    });
    this.bsModalRef.hide();
  }

  // ── Helpers ────────────────────────────────────────────────
  private toBoolean(value: any): boolean {
    return value === 1 || value === '1' || value === 'true' || value === true;
  }
}
