import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-features-modal',
  templateUrl: './role-features-modal.component.html',
  styleUrls: ['./role-features-modal.component.css'],
  standalone: false
})
export class RoleFeaturesModalComponent implements OnInit {

  title!: string;
  features: any[] = [];
  roleNo!: number;
  

  searchText: string = '';
  filteredFeatures: any[] = [];

  changedFeatures: any[] = [];
  

  public onClose!: Subject<any>;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.onClose = new Subject();
    

    if (!this.features) {
      this.features = [];
    }
    

    this.features = this.features.map(feature => ({
      ...feature,
      activeStatus: this.toBoolean(feature.activeStatus)
    }));
    

    this.filteredFeatures = [...this.features];
  }


  private toBoolean(value: any): boolean {
    if (value === 1 || value === '1' || value === 'true' || value === true) {
      return true;
    }
    return false;
  }

  onStatusChange(feature: any) {
    const existing = this.changedFeatures.find(
      f => f.submenuNo === feature.submenuNo
    );
  
    if (existing) {
      existing.activeStatus = feature.activeStatus ? 1 : 0;
    } else {
      
      this.changedFeatures.push({
        submenuNo: feature.submenuNo,
        featureId: feature.featureId,
        roleNo: feature.roleNo,
        roleName: feature.roleName,
        accessType: feature.accessType,
        typeName: feature.typeName,
        submenuName: feature.submenuName,
        menuName: feature.menuName,
        activeStatus: feature.activeStatus ? 1 : 0
      });
    }
  
    console.log("Changed Features → ", this.changedFeatures);
  }
  


  filterFeatures() {
    if (!this.searchText.trim()) {
      this.filteredFeatures = [...this.features];
      return;
    }
    
    const searchTerm = this.searchText.toLowerCase();
    this.filteredFeatures = this.features.filter(feature => {

      return (
        (feature.submenuName && feature.submenuName.toLowerCase().includes(searchTerm)) ||
        (feature.menuName && feature.menuName.toLowerCase().includes(searchTerm)) ||
        (feature.submenuNo && feature.submenuNo.toLowerCase().includes(searchTerm))
      );
    });
  }


  clearSearch() {
    this.searchText = '';
    this.filteredFeatures = [...this.features];
  }


  onCloseModal() {
    const result = {
      roleNo: this.roleNo,
      changedFeatures: this.changedFeatures
    };
    this.onClose.next(result);
    this.bsModalRef.hide();
  }
}