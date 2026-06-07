import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { EmployeeModel } from '../../../_coreSecurity/models/employee.model';
import { UserGrantDepartment } from '../../../_coreSecurity/models/user-grant-department.model';
import { UserGrantRole } from '../../../_coreSecurity/models/user-grant-role.model';
import { UserModel } from '../../../_coreSecurity/models/user.model';
import { DepartmentService } from '../../../_coreSecurity/services/department.service';
import { ModuleService } from '../../../_coreSecurity/services/module.service';
import { RoleService } from '../../../_coreSecurity/services/role.service';
import { UserGrantDepartmentService } from '../../../_coreSecurity/services/user-grant-department.service';
import { UserGrantRoleService } from '../../../_coreSecurity/services/user-grant-role.service';
import { UserService } from '../../../_coreSecurity/services/user.service';
import { RoleFeaturesModalComponent } from '../role-features-modal/role-features-modal.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  standalone: false,
})
export class AddUserComponent implements OnInit {
  selectedMfModule: any = null;

  // Role filter
  grSearchText: string = '';
  grFilter: 'all' | 'granted' = 'all';
  nsSelectedStoreNo: any;
  // activeTab: string = 'modulesFeatures';

  activeTab: 'modules' | 'role' = 'modules';

  get self(): AddUserComponent {
    return this;
  }
  user: UserModel = new UserModel();
  title: string = '';
  selectedUser: any;
  receivedEmp: any;
  today: Date = new Date();
  future: Date = new Date();
  selectedModuleId!: number;
  moduleList2: any[] = [];
  moduleList3: any[] = [];
  moduleList: any;
  allroleList: any;
  selectedRoles: any[] = [];
  isOpen: boolean = false;
  toggleButton: string = 'Close All';
  employeeDatasource!: Observable<any>;
  selectEmp!: string;
  selectEmpNo!: number;
  empSelect: string | null = null;
  selectedEmp: EmployeeModel | null = null;
  deptName: any;
  typeaheadLoading!: boolean;
  noResult!: boolean;
  cardHeader: string = '';
  showInfo = false;
  onClose: Subject<boolean>;
  invalidUser!: boolean;
  invalidId!: boolean;
  invalidPassword!: boolean;
  userId!: string;
  userName!: string;
  showPassword!: boolean;
  changedFeatureList: any[] = [];
  selectedRoleNo!: number;

  //-------for User Grant Department Flag--------
  departmentWithUserGrantList: UserGrantDepartment[] = [];
  grantDepartmentViewList: UserGrantDepartment[] = [];
  grantDepartmentSerch: string = '';
  selectedDepartmentNo!: number;

  //-start------for Grant NurseStation or DoctorStation---------
  nsDsListTitle: string = 'Nurse Station List';
  isDocOrNur: boolean = false;
  grantAllDsNsFlag: boolean = false;
  checkAllDsNsFlag: boolean = false;
  //----------------------end-----------------------------------
  billDiscountPrivList: any[] = [];
  ipdBillDiscountPrivList: any[] = [];
  companyHasDefault: boolean = false;
  selectedStoreNo!: number;
  isSaving: boolean = false;
  roleWithUserGrantList: UserGrantRole[] = [];
  grantRoleViewList: UserGrantRole[] = [];
  unchekedRoleFeatures: any[] = [];
  roleFeaturesMap: Map<number, any[]> = new Map();
  allRoleFeaturesChanged: any[] = [];
  constructor(
    public bsModalRef: BsModalRef,
    private moduleService: ModuleService,
    private deptService: DepartmentService,
    private roleService: RoleService,
    private userService: UserService,
    private toastr: ToastrService,
    private userGrantDepartmentService: UserGrantDepartmentService,
    private userGrantRoleService: UserGrantRoleService,
    public featureBsModalRef: BsModalRef,
    private modalService: BsModalService,
  ) {
    this.onClose = new Subject();
  }

  ngOnInit() {
    this.selectedUser ? (this.user = this.selectedUser) : this.user;
    if (this.selectedUser) {
      this.userId = this.selectedUser.userId;
      this.userName = this.selectedUser.userName;

      const payload = { id: this.selectedUser.id };

      this.moduleService
        .allModules(payload)
        .subscribe((res: { items: any[] }) => {
          this.moduleList = res.items;
          this.moduleList2 = this.moduleList;
          this.processMenuTree(res.items);
        });
    } else {
      this.moduleService.allModules().subscribe((res: { items: any[] }) => {
        this.moduleList = res.items;
        this.moduleList2 = this.moduleList;
        console.log('List ', res.items);
        this.processMenuTree(res.items);
      });
    }

    if (this.user.accountExpireDate) {
      this.user.accountExpireDate = new Date(
        this.selectedUser.accountExpireDate,
      );
    } else if (this.user.accountExpireDate == null) {
      this.user.accountExpireDate = new Date(
        this.future.setFullYear(this.future.getFullYear() + 2),
      );
    }

    this.roleService.getRoleList().subscribe((res: any) => {
      this.allroleList = res;
    });
    this.user.activeStatus = 1;
    console.log(this.selectedRoles);
    this.employeeDatasource = Observable.create((observer: any) => {
      observer.next(this.empSelect);
    }).pipe(mergeMap((token) => this.searchEmployee(token)));

    if (this.receivedEmp) {
      this.empSelect = this.receivedEmp.fname;
      if (this.selectedEmp) {
        this.selectedEmp.empId = this.receivedEmp.id;
        this.selectedEmp.fname = this.receivedEmp.fname;
      }

      this.deptName = this.receivedEmp.deptName;
      this.showInfo = true;
    }

    this.getDepartmentWithUserGrantList();
    this.getRoleWithUserGrantList();
  }

  processMenuTree(menuList: any[]) {
    const roots = [];
    const nodes: { [key: string]: any } = {};
    const dispval = [];

    for (let menu of menuList) {
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
      } else {
      }
    }

    this.moduleList3 = roots;
  }

  toggleTabs() {
    this.isOpen = !this.isOpen;
    this.isOpen
      ? (this.toggleButton = 'Close All')
      : (this.toggleButton = 'Expand All');
  }

  searchEmployee(token: any) {
    console.log(token);
    let searchObj = {
      fname: token.toUpperCase(),
      empId: token,
    };
    return this.userService.getEmpListByNameID(searchObj);
  }

  changeTypeaheadLoading(e: boolean): void {
    if (!this.empSelect?.length) {
      this.selectedEmp = null;
    }

    this.typeaheadLoading = e;
  }

  typeaheadNoResults(e: boolean): void {
    this.noResult = e;
    this.showInfo = false;
  }

  selectEmployee(getVal: any) {
    this.selectedEmp = getVal.item;
    this.empSelect = getVal.item.fname;
    this.user.empNo = getVal.item.id;
    this.showInfo = true;
    this.deptService
      .getDepartmentByNo(getVal.item.buNo)
      .subscribe((res: { buName: any }) => {
        this.deptName = res.buName;
      });

    if (
      this.selectedEmp &&
      (this.selectedEmp['doctorNo'] || this.selectedEmp['nurseFlag'] === 1)
    ) {
      this.isDocOrNur = true;
      this.nsDsListTitle = this.selectedEmp['doctorNo']
        ? 'Doctor Station List'
        : 'Nurse Station List';
    } else {
      this.isDocOrNur = false;
    }
  }

  saveUpdateUser() {
    this.isSaving = true;
    this.user.pwdChangeRequired = this.user.pwdChangeRequired ? 1 : 0;
    const data = {
      user: this.user,
      features: this.changedFeatureList,
    };

    if (this.user.id) {
      this.userService
        .updateUser(data)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: { success: boolean; message?: string }) => {
            console.log('res:', res);
            if (res.success) {
              this.toastr.success(res.message || 'User updated successfully.');
              this.saveUserGrantDepartments();
              this.saveUserGrantRole();
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to update user.');
            }
          },
          error: (err) => {
            console.error('Update user error:', err);
            this.toastr.error(
              'An error occurred while updating user. Please check your connection or try again.',
            );
          },
        });
    } else {
      if (this.user.userId && this.user.userName) {
        this.user.empNo = this.selectedEmp?.id ?? null;
      }

      this.userService
        .saveUser(data)
        .pipe(
          finalize(() => {
            this.isSaving = false;
          }),
        )
        .subscribe({
          next: (res: {
            success: boolean;
            message?: string;
            obj: UserModel;
          }) => {
            if (res.success) {
              this.toastr.success(res.message || 'User saved successfully.');
              this.user = res.obj;
              this.saveUserGrantDepartments();
              this.saveUserGrantRole();
              this.onClose.next(true);
              this.bsModalRef.hide();
            } else {
              this.toastr.warning(res.message || 'Failed to save user.');
            }
          },
          error: (err) => {
            console.error('Save user error:', err);
            this.toastr.error(
              'An error occurred while saving user. Please check your network or try again.',
            );
          },
        });
    }
  }

  validateUser() {
    if (this.user.userId && this.user.userId.includes(' ')) {
      this.toastr.warning('no white space allowed');
    }
    if (this.user.userName && this.user.userName.includes(' ')) {
      this.toastr.warning('no white space allowed');
    }
    const userName = {
      userName: this.user.userName,
    };

    const userId = {
      userId: this.user.userId,
    };

    if (this.user.id == null) {
      if (this.user.userName) {
        this.userService
          .validateName(userName)
          .subscribe((res: { success: any; message: string | undefined }) => {
            console.log(res);
            if (!res.success) {
              res.message == 'User Name must be unique';
              this.invalidUser = true;
              this.toastr.warning(res.message);
            }
          });
      }
      if (this.user.userId) {
        this.userService
          .validateId(userId)
          .subscribe((res: { success: any; message: string | undefined }) => {
            console.log(res);
            if (!res.success) {
              res.message == 'User ID must be unique';
              this.invalidId = true;
              this.toastr.warning(res.message);
            }
          });
      }
    }
    if (this.user.id) {
      if (this.user.userId.toUpperCase() !== this.userId.toUpperCase()) {
        console.log(this.selectedUser.userId);
        const data = {
          id: this.user.id,
          userId: this.user.userId,
        };
        this.userService
          .validateExisting(data)
          .subscribe((res: { success: any; message: string | undefined }) => {
            console.log(res);
            if (!res.success) {
              this.invalidId = true;
              this.toastr.warning(res.message);
            }
          });
      }
      if (this.user.userName.toUpperCase() !== this.userName.toUpperCase()) {
        console.log(this.userName, 'here');

        const data = {
          id: this.user.id,
          userName: this.user.userName,
        };
        this.userService
          .validateExisting(data)
          .subscribe((res: { success: any; message: string | undefined }) => {
            console.log(res, 'here 2');
            if (!res.success) {
              this.invalidUser = true;
              this.toastr.warning(res.message);
            }
          });
      }
    }
  }

  validatePassword() {
    if (this.user.password != null && this.user.password.length < 6) {
      this.invalidPassword = true;
      this.toastr.warning('Password must be at least 06 character');
    }
  }

  onEmpBackspace() {
    this.empSelect = null;
    this.user.empNo = null;
    this.selectedEmp = null;
    this.showInfo = false;
    this.receivedEmp = null;
  }

  getSelectedModule(moduleId: any) {
    this.moduleList2 = [];
    this.moduleList2.push(moduleId);
  }

  clearSelectedModule() {
    this.moduleList2 = this.moduleList;
  }

  public getSelectedFeature(feature: any, checked: any) {
    if (checked) {
      feature.updatedStatus = true;
    } else {
      feature.updatedStatus = false;
    }

    let changedFeature = this.changedFeatureList.filter((element) => {
      return element.featureId === feature.featureId;
    });
    console.log(changedFeature);

    if (changedFeature.length == 0) {
      this.changedFeatureList.push(feature);
    }

    if (changedFeature.length == 1) {
      let index = this.changedFeatureList.indexOf(feature);
      if (index > -1) {
        this.changedFeatureList[index] = feature;
      }
      if (
        this.changedFeatureList[index].isGranted ==
        this.changedFeatureList[index].updatedStatus
      ) {
        this.changedFeatureList.splice(index, 1);
      }
    }
    console.log(changedFeature, this.changedFeatureList);
  }

  //-------for User Grant Department Flag--------
  getDepartmentWithUserGrantList() {
    let userGrantDep: UserGrantDepartment = new UserGrantDepartment();
    userGrantDep.userNo = this.user.id;

    this.userGrantDepartmentService
      .getDepartmentWithUserGrantList(userGrantDep)
      .subscribe((res) => {
        if (res.success) {
          this.departmentWithUserGrantList = res.items;

          this.departmentWithUserGrantList = this.departmentWithUserGrantList
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .reverse();

          this.grantDepartmentViewList = this.departmentWithUserGrantList;
        }
      });
  }

  getSelectedDepartmentValue(dIndex: number, property: string, event: Event) {
    const input = event.target as HTMLInputElement | null;
    const isChecked = input?.checked ?? false;

    const buNo = this.grantDepartmentViewList[dIndex].buNo;

    this.departmentWithUserGrantList.forEach((element, index) => {
      if (element.buNo === buNo) {
        this.departmentWithUserGrantList[index][property] = isChecked ? 1 : 0;
        this.departmentWithUserGrantList[index].isChange = true;
        console.log(
          'DepartmentWithUserGrantList',
          this.departmentWithUserGrantList[index],
        );
      }
    });
  }

  saveUserGrantDepartments() {
    let finalDepartmentList: UserGrantDepartment[] = [];
    this.departmentWithUserGrantList.forEach((element) => {
      if (element.isChange) {
        element.userNo = this.user.id;
        finalDepartmentList.push(element);
      }
    });

    this.userGrantDepartmentService
      .saveUserGrantDepartmentList(finalDepartmentList)
      .subscribe((res) => {
        if (res.success) {
          // this.toastr.success(res.message)
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message);
        }
      });
  }

  filterGrantDepartment() {
    this.grantDepartmentViewList = [];
    if (this.selectedDepartmentNo) {
      this.departmentWithUserGrantList.forEach((element) => {
        if (element.buNo == this.selectedDepartmentNo) {
          this.grantDepartmentViewList.push(element);
        }
      });
    } else {
      this.grantDepartmentViewList = this.departmentWithUserGrantList;
    }
  }

  filterGrantRole() {
    this.grantRoleViewList = [];
    if (this.selectedRoleNo) {
      this.roleWithUserGrantList.forEach((element: any) => {
        if (element.roleNo == this.selectedRoleNo) {
          this.grantRoleViewList.push(element);
        }
      });
    } else {
      this.grantRoleViewList = this.roleWithUserGrantList;
    }
  }

  getSelectedRoleValue(rIndex: number, property: string, event: Event) {
    const input = event.target as HTMLInputElement | null;
    const checked = input?.checked ?? false;

    const roleNo = this.grantRoleViewList[rIndex].roleNo;

    this.roleWithUserGrantList.forEach((element, index) => {
      if (element.roleNo == roleNo) {
        this.roleWithUserGrantList[index][property] = checked ? 1 : 0;
        this.roleWithUserGrantList[index].isChange = true;
      }
    });
  }

  getRoleWithUserGrantList() {
    let userGrantRole: UserGrantRole = new UserGrantRole();
    userGrantRole.userNo = this.user.id;

    this.userGrantRoleService
      .getRoleWithGrantList(userGrantRole)
      .subscribe((res) => {
        if (res.success) {
          this.roleWithUserGrantList = res.items;
          this.roleWithUserGrantList = this.roleWithUserGrantList
            .sort((a, b) => (a.id > b.id ? 1 : -1))
            .reverse();
          this.grantRoleViewList = this.roleWithUserGrantList;
          console.log('this.grantRoleViewList', this.grantRoleViewList);
        }
      });
  }

  loadRoleFeatures(roleGrant: UserGrantRole) {
    roleGrant.loadingFeatures = true;

    const requestPayload = {
      roleNo: roleGrant.roleNo,
      userNo: this.user.id,
      companyNo: 1,
    };

    this.userGrantRoleService.getRoleFeaturesNew(requestPayload).subscribe(
      (res) => {
        if (res.success) {
          roleGrant.features = res.items || [];
          // roleGrant.features = (res.items || []).filter(f => f.activeStatus);
          this.showRoleFeaturesModal(roleGrant);
        } else {
          this.toastr.warning('Failed to load role features');
          roleGrant.features = [];
        }
        roleGrant.loadingFeatures = false;
      },
      (err) => {
        console.error('Error loading role features', err);
        this.toastr.warning('Error loading role features');
        roleGrant.features = [];
        roleGrant.loadingFeatures = false;
      },
    );
  }

  saveUserGrantRole() {
    if (
      !this.roleWithUserGrantList ||
      this.roleWithUserGrantList.length === 0
    ) {
      this.toastr.warning('Role list is empty!');
      return;
    }

    const allUncheckedFeatures: any[] = [];

    const finalUncheckedFeatures =
      this.allRoleFeaturesChanged.length > 0
        ? this.allRoleFeaturesChanged
        : allUncheckedFeatures;

    const roleGrantListWithUser = this.roleWithUserGrantList.map((role) => ({
      ...role,
      userNo: this.user.id,

      changedFeatures: role.changedFeatures || [],
    }));

    const payload = {
      userNo: this.user.id,
      roleGrantList: roleGrantListWithUser,
      uncheckedFeature: finalUncheckedFeatures,
    };

    this.userGrantRoleService
      .saveUserGrantRoleList(payload)
      .subscribe((res) => {
        if (res.success) {
          this.toastr.success('All role features saved successfully');
          this.onClose.next(true);
          this.bsModalRef.hide();
        } else {
          this.toastr.warning(res.message);
        }
      });
  }

  showRoleFeaturesModal(roleGrant: UserGrantRole) {
    const initialState = {
      title: `Features for Role: ${roleGrant.roleName}`,
      features: roleGrant.features || [],
      roleNo: roleGrant.roleNo,
      roleName: roleGrant.roleName,
    };

    this.featureBsModalRef = this.modalService.show(
      RoleFeaturesModalComponent,
      {
        initialState,
        class: 'sub-modal modal-lg',
        backdrop: 'static',
        keyboard: true,
      },
    );

    this.featureBsModalRef.content.onClose.subscribe(
      (result: { roleNo: number; changedFeatures: any[] }) => {
        if (result) {
          console.log(
            `Role ${result.roleNo} features ->`,
            result.changedFeatures,
          );

          this.roleFeaturesMap.set(result.roleNo, result.changedFeatures);

          if (result.changedFeatures && result.changedFeatures.length > 0) {
            this.allRoleFeaturesChanged = this.allRoleFeaturesChanged.concat(
              result.changedFeatures,
            );
          }

          roleGrant.changedFeatures = result.changedFeatures;
        }
      },
    );
  }

  get grantedRoleCount(): number {
    return this.roleWithUserGrantList.filter((role) => role.id != null).length;
  }

  get filteredGrantRoleList(): UserGrantRole[] {
    let list = this.grantRoleViewList;
    if (this.grFilter === 'granted') {
      list = list.filter((role) => role.id != null);
    }
    const q = this.grSearchText.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (role) => role.roleName && role.roleName.toLowerCase().includes(q),
      );
    }
    return list;
  }

  // ── Methods to add ───────────────────────────────────────────────────────────

  setGrFilter(filter: 'all' | 'granted') {
    this.grFilter = filter;
  }

  onRoleFlagChange(roleGrant: UserGrantRole, property: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.roleWithUserGrantList.forEach((element, index) => {
      if (element.roleNo == roleGrant.roleNo) {
        (this.roleWithUserGrantList[index] as any)[property] = checked ? 1 : 0;
        this.roleWithUserGrantList[index].isChange = true;
      }
    });
  }

  // ── Modules & Features helpers ──────────────────────────────────────────

  getMfLeaves(module: any): any[] {
    const result: any[] = [];
    this._collectMfLeaves(module.children || [], result);
    return result;
  }

  private _collectMfLeaves(children: any[], result: any[]) {
    for (const child of children) {
      if (
        child.featureDtosList &&
        child.featureDtosList.length > 0 &&
        child.children &&
        child.children.length === 0
      ) {
        if (child['_open'] === undefined) child['_open'] = true;
        result.push(child);
      } else if (child.children && child.children.length > 0) {
        this._collectMfLeaves(child.children, result);
      }
    }
  }

  isMfFeatureGranted(feature: any): boolean {
    return feature.updatedStatus !== undefined
      ? feature.updatedStatus
      : !!feature.isGranted;
  }

  toggleMfFeature(feature: any) {
    this.getSelectedFeature(feature, !this.isMfFeatureGranted(feature));
  }

  toggleMfSub(sub: any) {
    sub['_open'] = sub['_open'] === false ? true : false;
  }

  toggleMfSubAll(sub: any) {
    const granted = this.getMfSubGranted(sub);
    const total = this.getMfSubTotal(sub);
    const newVal = granted < total;
    (sub.featureDtosList || []).forEach((f: any) =>
      this.getSelectedFeature(f, newVal),
    );
  }

  getMfSubGranted(sub: any): number {
    return (sub.featureDtosList || []).filter((f: any) =>
      this.isMfFeatureGranted(f),
    ).length;
  }

  getMfSubTotal(sub: any): number {
    return (sub.featureDtosList || []).length;
  }

  getMfSubPct(sub: any): number {
    const t = this.getMfSubTotal(sub);
    return t === 0 ? 0 : Math.round((this.getMfSubGranted(sub) / t) * 100);
  }

  getMfProgressColor(pct: number): string {
    if (pct === 0) return '#9aa0bc';
    if (pct === 100) return '#1fc98a';
    if (pct >= 60) return '#4b8df8';
    return '#f0a040';
  }

  denyAllMf(module: any) {
    this.getMfLeaves(module).forEach((sub) =>
      sub.featureDtosList.forEach((f: any) =>
        this.getSelectedFeature(f, false),
      ),
    );
  }
}
