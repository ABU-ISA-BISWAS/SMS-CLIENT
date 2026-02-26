import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ModuleService } from '../../../_coreSecurity/services/module.service';
import { RoleService } from '../../../_coreSecurity/services/role.service';
import { RoleModel } from '../../../_coreSecurity/models/role.model';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-role-new',
  templateUrl: './add-role-new.component.html',
  styleUrls: ['./add-role-new.component.css'],
  standalone: false
})
export class AddRoleNewComponent implements OnInit {

  role: RoleModel = new RoleModel();
  title: string = "";
  selectedRole: any;
  self = this;


  moduleList: any[] = [];
  moduleList2: any[] = [];
  moduleList3: any[] = [];
  isOpen: boolean = false;
  toggleButton: string = "Close All";
  cardHeader: string = 'card-header'
  onClose: Subject<boolean>;
  invalidRoleId: boolean = false;
  invalidRoleName: boolean = false;
  changedFeatureList: any[] = [];

  constructor(public bsModalRef: BsModalRef,
    private moduleService: ModuleService,
    private roleService: RoleService,
    private toastr: ToastrService
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    if (this.selectedRole) {
      this.role = { ...this.selectedRole };
      const user = { id: this.role.id };
      this.moduleService.allModulesRole(user).subscribe(res => {
        this.moduleList = res.items;
        this.moduleList2 = this.moduleList;
        this.processMenuTree(res.items);
      });
    } else {
      this.moduleService.allModulesRole().subscribe(res => {
        this.moduleList = res.items;
        this.moduleList2 = this.moduleList;
        this.processMenuTree(res.items);
      });
    }

    this.role.activeStatus = this.role.activeStatus || 1;
  }

  processMenuTree(menuList: any[]) {
    let roots: any[] = [];
    let nodes: {
      displayName: any;
      id: any;
      featureDtosList: any;
      children: any[];
    }[] = [];

    for (let i in menuList) {
      let menu = menuList[i];

      nodes[menu.id] = {
        displayName: menu.displayName,
        id: menu.id,
        featureDtosList: menu.featureDtosList,
        children: []
      };

      if (menu.prentId == null) {
        roots.push(nodes[menu.id]);
      } else if (nodes[menu.prentId]) {
        nodes[menu.prentId].children.push(nodes[menu.id]);
      }
    }

    this.moduleList3 = roots;
  }

  toggleTabs() {
    this.isOpen = !this.isOpen;
    this.isOpen ? this.toggleButton = "Close All" : this.toggleButton = "Expand All";
  }

  public getSelectedFeature(feature: any, checked: any) {
    console.log('Feature event received:', event);

    if (checked) {
      feature.updatedStatus = true;
    } else {
      feature.updatedStatus = false;
    }

    let changedFeature = this.changedFeatureList.filter(element => {
      return element.featureId === feature.featureId;
    });

    if (changedFeature.length === 0) {
      this.changedFeatureList.push(feature);
      console.log('Feature added to changedFeatureList:', feature);
    } else if (changedFeature.length === 1) {
      let index = this.changedFeatureList.findIndex(element =>
        element.featureId === feature.featureId
      );
      if (index > -1) {
        this.changedFeatureList[index] = feature;
        console.log('Feature updated in changedFeatureList:', feature);
      }
      if (this.changedFeatureList[index].isGranted === this.changedFeatureList[index].updatedStatus) {
        this.changedFeatureList.splice(index, 1);
        console.log('Feature removed from changedFeatureList:', feature);
      }
    }

    console.log('Current changedFeatureList:', this.changedFeatureList);
  }

  saveUpdateRole() {
    // Validate before proceeding
    if (!this.role.roleId || this.role.roleId.trim() === '') {
      this.toastr.warning("Please enter Role ID");
      this.invalidRoleId = true;
      return;
    }

    if (!this.role.roleName || this.role.roleName.trim() === '') {
      this.toastr.warning("Please enter Role Name");
      this.invalidRoleName = true;
      return;
    }

    if (this.role.roleId.includes(' ')) {
      this.toastr.warning("Role ID cannot contain spaces");
      this.invalidRoleId = true;
      return;
    }

    // Rest of your save logic...
    const processedFeatures = this.changedFeatureList.map(feature => ({
      featureId: feature.featureId,
      featureCode: feature.featureCode || null,
      featureName: feature.featureName,
      isGranted: feature.isGranted,
      updatedStatus: feature.updatedStatus
    }));

    const payload = {
      role: this.role,
      features: processedFeatures
    };

    // console.log('Payload to be sent:', payload);

    if (this.role.id) {
      this.roleService.updateRole(payload).subscribe(res => {
        if (res.success) {
          this.toastr.success(res.message);
          if (res.obj) {
            this.role = res.obj;
            this.moduleList = res.obj.features || [];
            this.processMenuTree(this.moduleList);
          }
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message);
        }
      });
    } else {
      this.roleService.saveRole(payload).subscribe(res => {
        if (res.success) {
          this.toastr.success(res.message);
          if (res.obj) {
            this.role = res.obj;
            this.moduleList = res.obj.features || [];
            this.processMenuTree(this.moduleList);
          }
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message);
        }
      });
    }
  }

  getSelectedModule(moduleId: any) {
    this.moduleList2 = [];
    this.moduleList2.push(moduleId);
  }

  clearSelectedModule() {
    this.moduleList2 = this.moduleList;
  }

  onStatusChange(event: any) {
    this.role.activeStatus = event.target.checked ? 1 : 0;
  }
}

