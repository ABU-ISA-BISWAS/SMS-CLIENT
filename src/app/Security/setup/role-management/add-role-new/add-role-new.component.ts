import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Optional,
  Output,
} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RoleModel } from '../../../_coreSecurity/models/role.model';
import { ModuleService } from '../../../_coreSecurity/services/module.service';
import { RoleService } from '../../../_coreSecurity/services/role.service';

@Component({
  selector: 'app-add-role-new',
  templateUrl: './add-role-new.component.html',
  styleUrls: ['./add-role-new.component.css'],
  standalone: false,
})
export class AddRoleNewComponent implements OnInit {
  // ── Inputs (set by parent inline OR by modal initialState) ──
  @Input() title: string = '';
  @Input() selectedRole: any = null;

  // ── Outputs ─────────────────────────────────────────────────
  @Output() onSaveSuccess = new EventEmitter<void>();

  role: RoleModel = new RoleModel();
  self = this;

  moduleList: any[] = [];
  moduleList2: any[] = [];
  moduleList3: any[] = [];
  isOpen: boolean = false;
  toggleButton: string = 'Close All';
  cardHeader: string = 'card-header';
  onClose: Subject<boolean>;
  invalidRoleId: boolean = false;
  invalidRoleName: boolean = false;
  changedFeatureList: any[] = [];

  constructor(
    @Optional() public bsModalRef: BsModalRef,
    private moduleService: ModuleService,
    private roleService: RoleService,
    private toastr: ToastrService,
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    if (this.selectedRole) {
      this.role = { ...this.selectedRole };
      const user = { id: this.role.id };
      this.moduleService.allModulesRole(user).subscribe((res) => {
        this.moduleList = res.items;
        this.moduleList2 = this.moduleList;
        this.processMenuTree(res.items);
      });
    } else {
      this.moduleService.allModulesRole().subscribe((res) => {
        this.moduleList = res.items;
        this.moduleList2 = this.moduleList;
        this.processMenuTree(res.items);
      });
    }
    this.role.activeStatus = this.role.activeStatus || 1;
  }

  processMenuTree(menuList: any[]) {
    let roots: any[] = [];
    let nodes: any[] = [];
    for (let i in menuList) {
      let menu = menuList[i];
      nodes[menu.id] = {
        displayName: menu.displayName,
        id: menu.id,
        featureDtosList: menu.featureDtosList,
        children: [],
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
    this.toggleButton = this.isOpen ? 'Close All' : 'Expand All';
  }

  public getSelectedFeature(feature: any, checked: any) {
    feature.updatedStatus = !!checked;

    let changedFeature = this.changedFeatureList.filter(
      (el) => el.featureId === feature.featureId,
    );

    if (changedFeature.length === 0) {
      this.changedFeatureList.push(feature);
    } else {
      let index = this.changedFeatureList.findIndex(
        (el) => el.featureId === feature.featureId,
      );
      if (index > -1) {
        this.changedFeatureList[index] = feature;
        if (
          this.changedFeatureList[index].isGranted ===
          this.changedFeatureList[index].updatedStatus
        ) {
          this.changedFeatureList.splice(index, 1);
        }
      }
    }
  }

  saveUpdateRole() {
    if (!this.role.roleId?.trim()) {
      this.toastr.warning('Please enter Role ID');
      this.invalidRoleId = true;
      return;
    }
    if (!this.role.roleName?.trim()) {
      this.toastr.warning('Please enter Role Name');
      this.invalidRoleName = true;
      return;
    }
    if (this.role.roleId.includes(' ')) {
      this.toastr.warning('Role ID cannot contain spaces');
      this.invalidRoleId = true;
      return;
    }

    const payload = {
      role: this.role,
      features: this.changedFeatureList.map((f) => ({
        featureId: f.featureId,
        featureCode: f.featureCode || null,
        featureName: f.featureName,
        isGranted: f.isGranted,
        updatedStatus: f.updatedStatus,
      })),
    };

    const save$ = this.role.id
      ? this.roleService.updateRole(payload)
      : this.roleService.saveRole(payload);

    save$.subscribe((res) => {
      if (res.success) {
        this.toastr.success(res.message);
        // notify inline parent
        this.onSaveSuccess.emit();
        // also notify modal parent (if opened as modal)
        this.onClose.next(true);
        this.bsModalRef?.hide();
      } else {
        this.toastr.warning(res.message);
      }
    });
  }

  onStatusChange(event: any) {
    this.role.activeStatus = event.target.checked ? 1 : 0;
  }

  getSelectedModule(moduleId: any) {
    this.moduleList2 = [];
    this.moduleList2.push(moduleId);
  }

  clearSelectedModule() {
    this.moduleList2 = this.moduleList;
  }
}
