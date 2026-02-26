import { Component, OnInit, ViewChild } from '@angular/core';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { UserFeatureService } from '../../../auth/_service/user-feature.service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { DepartmentService } from '../../_coreSecurity/services/department.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { UserService } from '../../_coreSecurity/services/user.service';
import { AddUserComponent } from './add-user/add-user.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: false,
})
export class UsersComponent implements OnInit {
  @ViewChild('userGrid') userGrid: any;
  bsModalRef!: BsModalRef;
  userTable: any;
  userTableObj: any;
  selectedUser: any;
  selectedRole: any;
  selectedEmp: any;
  future: Date = new Date();
  disableButton: string = 'Disable';
  enabledDisabledFlag: string = 'E';
  previledgeDisabledBtn: boolean = false;
  moduleList: any;
  moduleList3: any;
  selecteDataArr: any = [];
  moduleData!: Observable<any>;
  searchModuleStr!: string | null;
  typeaheadLoading!: boolean;
  searchFavoriteStr!: string;
  noResult = false;
  isreportFlter: boolean = false;
  moduleNoList: any = [];
  selectActiveSta: any = 1;
  selectUnituser: any = 0;
  mAccUser: boolean = false;
  accDtl: boolean = false;
  constructor(
    private moduleService: ModuleService,
    private modalService: BsModalService,
    private authService: AuthService,
    private featureService: UserFeatureService,
    private userService: UserService,
    private deptService: DepartmentService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.moduleData = new Subject();
    this.getPreviledge();
    this.getmodule();
    this.initiateTypeaheadData();

    this.initTypeAheadEmpIdDataSource();
    this.initTypeAheadEmpNameDataSource();
    this.initTypeAheadUserIdDataSource();
    this.initTypeAheadUserNameDataSource();
  }
  ngAfterViewInit() {
    this.initUserGrid();
  }

  getPreviledge() {
    this.featureService.getAuthorizePreviledge().subscribe((res) => {
      if (res.items != null) {
        for (let i in res.items) {
          if (res.items[i].featureCode == 'SAS008' && res.items[i].isGranted) {
            this.previledgeDisabledBtn = true;
          } else if (
            res.items[i].featureCode == 'SAS007' &&
            res.items[i].isGranted
          ) {
            this.isreportFlter = true;
          }
        }
      }
    });
  }

  addFG() {
    const initialState = {
      title: 'Add New User',
      showPassword: true,
    };
    this.bsModalRef = this.modalService.show(AddUserComponent, {
      class: 'modal-xl modalAuto base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe(() => {
      this.userTableObj.draw();
    });
  }

  editFG() {
    if (!this.selectedUser) {
      this.toastr.warning('Please select an user first!');
    } else {
      const initialState = {
        selectedUser: this.selectedUser,
        title: 'Edit User',
        receivedEmp: this.selectedEmp,
      };
      this.bsModalRef = this.modalService.show(AddUserComponent, {
        class: 'modal-xl modalAuto base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((res: any) => {
        if (res) {
          this.userTableObj.draw();
          // console.log(res);
          this.selectedUser = null;
        }
      });
    }
  }

  deleteFG() {}

  docSetup() {}

  // Data Grid
  initUserGrid() {
    let that = this;
    this.userTable = $(this.userGrid.nativeElement);
    this.userTableObj = this.userTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/coreUser/gridList',
        type: 'GET',
        data: function (sendData: any) {
          sendData.enabledDisabledFlag = that.enabledDisabledFlag;
        },
        beforeSend: function (xhr: {
          setRequestHeader: (arg0: string, arg1: string) => void;
        }) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        dataSrc: function (response: {
          draw: any;
          obj: {
            draw: any;
            recordsTotal: any;
            recordsFiltered: any;
            data: any;
          };
          recordsTotal: any;
          recordsFiltered: any;
        }) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: { responseText: any }) {
          console.log('Data Grid Rendering Error', request.responseText);
        },
      },
      order: [[0, 'desc']],
      columns: [
        {
          visible: false,
          data: 'userModifiedOn',
          name: 'userModifiedOn',
        },
        {
          title: 'User ID.',
          data: 'userId',
          name: 'userId',
        },
        {
          title: 'User Name',
          data: 'userName',
          name: 'userName',
        },
        {
          title: 'Emp. ID',
          data: 'empId',
        },
        {
          title: 'Emp. Name',
          data: 'empName',
          name: 'empName',
        },
        {
          title: 'Job Title',
          data: 'jobtitle',
          name: 'jobtitle',
          width: '100px',
        },
        {
          title: 'Unit',
          data: 'unitName',
          width: '150px',
        },
        {
          title: 'Unit User',
          data: 'unitUserFlag',
          render: (data: number) => {
            return data >= 1 ? '<i class="fas fa-check-square h5"></i>' : '';
          },
        },
        {
          title: 'Created at',
          data: 'userCreatedOn',
          render: (data: string | number | Date) => {
            return moment(new Date(data)).format('DD-MM-YYYY').toString();
          },
        },
        {
          title: 'Status',
          data: 'enabled',
          render: (data: number) => {
            console.log('data:active:', data);
            if (data == 1) {
              return '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>';
            } else {
              return '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
            }
          },
        },
        {
          title: 'Account Status',
          data: 'accountLocked',
          render: (data: boolean) => {
            return data == false ? 'Regular' : 'Locked';
          },
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any | Object) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          if (self.selectedUser || self.selectedEmp) {
            self.selectedUser = null;
            self.selectedEmp = null;
          }
          self.selectedUser = data;

          this.setUserOrEmpData(data, data);
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.userService.findUserById(data.id).subscribe((res: any) => {
            self.selectedUser = res;
            self.selectedUser.enabled
              ? (this.disableButton = 'Disable')
              : (this.disableButton = 'Enable');
          });
          if (data.empNo) {
            this.userService
              .findEmpByNo(self.selectedUser.empNo)
              .subscribe((res: any) => {
                if (res) {
                  this.selectedEmp = res;
                  this.deptService
                    .getDepartmentByNo(this.selectedEmp.buNo)
                    .subscribe((res: { buName: any }) => {
                      this.selectedEmp.deptName = res.buName;
                    });
                }
              });
          }
        });
        return row;
      },
    });
  }

  processMenuTree(menuList: any[]) {
    let roots = [];
    const nodes: { [key: string]: any } = {};
    let dispval = [];

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
      } else {
      }
    }
    this.moduleList3 = roots;
  }

  getmodule() {
    const reg = {
      findParentOnly: true,
    };
    this.moduleService.allPatentModules(reg).subscribe((res: any) => {
      this.moduleList = res;
    });
  }

  initiateTypeaheadData(): any {
    return (this.moduleData = Observable.create((observer: any) => {
      observer.next(this.searchModuleStr);
    }).pipe(mergeMap((token: string) => this.getTpeaheadDataList(token))));
  }
  getTpeaheadDataList(searchString: string): any {
    const reqObj = {
      menuName: searchString,
      findParentOnly: true,
    };
    return this.moduleService.allPatentModules(reqObj);
  }
  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  noResultsFound(event: boolean): void {
    this.noResult = event;
  }
  onSelectModule(event: any) {
    const dupItem = this.selecteDataArr.filter((element: { id: any }) => {
      return element.id === event.item.id;
    });
    if (dupItem.length > 0) {
      this.toastr.warning('Item Already Added!');
    } else {
      this.selecteDataArr.push(event.item);
      this.searchModuleStr = null;
    }
  }

  onDelete(index: number) {
    this.selecteDataArr.splice(index, 1);
  }

  disableFG(): void {
    if (!this.selectedUser) {
      this.toastr.warning('Please select an user first!');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this user?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((res: any) => {
        if (res) {
          this.selectedUser.enabled = this.enabledDisabledFlag == 'D' ? 1 : 0;
          this.userService
            .disableUser(this.selectedUser)
            .subscribe((res: { success: any; message: string | undefined }) => {
              if (res.success) {
                this.toastr.success(res.message);
              } else {
                this.toastr.warning(res.message);
              }
              this.userTableObj.draw();
            });
        }
      });
    }
  }

  changePassword() {
    if (!this.selectedUser) {
      this.toastr.warning('Please select an user first!');
    } else {
      const initialState = {
        selectedUser: this.selectedUser,
      };
      this.bsModalRef = this.modalService.show(ChangePasswordComponent, {
        class: 'modal-md base-modal',
        initialState,
      });
      this.bsModalRef.content.onClose.subscribe((res: any) => {
        if (res) {
          this.userTableObj.draw();
          this.selectedUser = null;
        }
      });
    }
  }

  statusCheck(status: string) {
    this.enabledDisabledFlag = status;
    if (this.enabledDisabledFlag == 'E') {
      this.disableButton = 'Disable';
    } else {
      this.disableButton = 'Enable';
    }
    this.userTableObj.draw();
  }

  getSelectedActive(checked: any) {
    if (checked) {
      this.selectActiveSta = 1;
    } else {
      this.selectActiveSta = 0;
    }
  }
  getSelectedUnitUser(checked: any) {
    if (checked) {
      this.selectUnituser = 1;
    } else {
      this.selectUnituser = 0;
    }
  }

  //=======typeAhead: User=================
  userNameDataSource!: Observable<any>;
  userIdDataSource!: Observable<any>;
  userNameSearchText!: string;
  userIdSearchText!: string;
  taSelectedUser: any;

  initTypeAheadUserNameDataSource(): any {
    this.userNameDataSource = Observable.create((observer: any) => {
      observer.next(this.userNameSearchText);
    }).pipe(mergeMap((token) => this.searchByUserIdOrName(token)));
  }
  initTypeAheadUserIdDataSource(): any {
    this.userIdDataSource = Observable.create((observer: any) => {
      observer.next(this.userIdSearchText);
    }).pipe(mergeMap((token) => this.searchByUserIdOrName(token)));
  }
  searchByUserIdOrName(token: any) {
    let searchObj = {
      userIdOrName: token.toUpperCase(),
    };
    return this.userService.getUserListByNameID(searchObj);
  }
  selectUser(getVal: any) {
    this.taSelectedUser = getVal.item;
    this.userIdSearchText = this.taSelectedUser.userId;
    this.userNameSearchText = this.taSelectedUser.userName;

    this.setUserOrEmpData(this.taSelectedUser, null);
  }
  //=======typeAhead: Employee=================
  employeeNameDataSource!: Observable<any>;
  employeeIdDataSource!: Observable<any>;
  empNameSearchText!: string;
  empIdSearchText!: string;
  taSelectedEmployee: any;

  initTypeAheadEmpNameDataSource(): any {
    this.employeeNameDataSource = Observable.create((observer: any) => {
      observer.next(this.empNameSearchText);
    }).pipe(mergeMap((token) => this.searchByEmployeeIdOrName(token)));
  }
  initTypeAheadEmpIdDataSource(): any {
    this.employeeIdDataSource = Observable.create((observer: any) => {
      observer.next(this.empIdSearchText);
    }).pipe(mergeMap((token) => this.searchByEmployeeIdOrName(token)));
  }
  searchByEmployeeIdOrName(token: any) {
    let searchObj = {
      empIdOrName: token,
    };

    return this.userService.getUserListByNameID(searchObj);
  }
  selectEmployee(getVal: any) {
    this.taSelectedEmployee = getVal.item;
    this.empIdSearchText = this.taSelectedEmployee.empId;
    this.empNameSearchText = this.taSelectedEmployee.empName;

    this.setUserOrEmpData(null, this.taSelectedEmployee);
  }

  setUserOrEmpData(
    user: { empId: string; empName: string } | null,
    emp: { userId: string; userName: string } | null,
  ) {
    if (user) {
      this.taSelectedEmployee = {
        empId: user.empId,
        empName: user.empName,
      };
      this.empNameSearchText = user.empName;
      this.empIdSearchText = user.empId;
    }
    if (emp) {
      this.taSelectedUser = {
        userId: emp.userId,
        userName: emp.userName,
      };
      this.userIdSearchText = emp.userId;
      this.userNameSearchText = emp.userName;
    }
  }
}
