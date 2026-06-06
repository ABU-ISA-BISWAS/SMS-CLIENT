import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Building } from '../../../_coreSecurity/models/building.model';
import { BuildingService } from '../../../_coreSecurity/services/building.service';

@Component({
  selector: 'app-add-building',
  templateUrl: './add-building.component.html',
  styleUrls: ['./add-building.component.css'],
  standalone: false,
})
export class AddBuildingComponent implements OnInit {
  building: Building = new Building();
  onClose!: Subject<boolean>;
  title = '';
  isSaving: boolean = false;

  constructor(
    public bsModalRef: BsModalRef,
    private buildingService: BuildingService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.onClose = new Subject();
    if (!this.building.id) this.building.activeStatus = 1;
  }

  saveBuilding() {
    this.isSaving = true;
    this.toggleValue(this.building);

    if (!this.checkValidation()) {
      this.isSaving = false;
      return;
    }

    const req$ = this.building.id
      ? this.buildingService.update(this.building)
      : this.buildingService.save(this.building);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Building saved successfully!');
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message || 'Operation failed.');
          this.onClose.next(false);
        }
      },
      error: () => {
        this.toastr.error('Something went wrong. Please try again.');
        this.onClose.next(false);
      },
    });
  }

  checkValidation(): boolean {
    if (!this.building.buildingCode) {
      this.toastr.warning("Building Code can't be empty!");
      return false;
    }
    if (!this.building.buildingName) {
      this.toastr.warning("Building Name can't be empty!");
      return false;
    }
    return true;
  }

  toggleValue(obj: any) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === true) obj[key] = 1;
      if (obj[key] === false) obj[key] = 0;
    });
  }
}
