import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { AddRoleNewComponent } from './add-role-new/add-role-new.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { RoleService } from '../../_coreSecurity/services/role.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  standalone: false
})
export class RoleManagementComponent implements OnInit {


  @ViewChild('roleGrid')
  roleGrid!: { nativeElement: any; };
  bsModalRef!: BsModalRef;
  bsModalRefDel!: BsModalRef;
  roleTable: any;
  roleTableObj: any;
  selectedRole: any;
  disableButton: string = "Disable";
  activeStatus = "1";
  enabledDisabledFlag: string = 'E';
  roleViewObj: any = {
    roleId: '',
    roleName: '',
    activeStat: 0
  };

  constructor(private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private roleService: RoleService,
  ) { }


  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initRoleGrid();
  }
  addRole() {

    const initialState = {
      title: "Add Role",
      showPassword: true
    }
    this.bsModalRef = this.modalService.show(AddRoleNewComponent, { class: 'modal-xl modalAuto base-modal', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(() => {
      this.roleTableObj.draw();
    })
  }

  editRole() {
    if (!this.selectedRole) {
      this.toastr.warning("No role selected for editing.");
      return;
    }

    const initialState = {
      title: "Edit Role",
      selectedRole: this.selectedRole
    };

    this.bsModalRef = this.modalService.show(AddRoleNewComponent, { class: 'modal-xl modalAuto base-modal', initialState, backdrop: 'static' });
    this.bsModalRef.content.onClose.subscribe(() => {
      this.roleTableObj.draw();
    });
  }

  onDeleteModal() {
    if (!this.selectedRole) {
      this.toastr.warning("Please Select a Role!");
      return;
    }

    const initialState = {
      title: "Do you want to Delete?",
      message: `Role: ${this.selectedRole.roleName}`
    };
    this.bsModalRefDel = this.modalService.show(ConfirmationDialog, { initialState, class: 'modal-sm', backdrop: 'static' });

    this.bsModalRefDel.content.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteRole();
      }
    });
  }

  deleteRole() {
    if (!this.selectedRole || !this.selectedRole.id) {
      this.toastr.warning("Invalid Role Selected!");
      return;
    }

    this.roleService.deleteRole(this.selectedRole.id).subscribe(
      () => {
        this.toastr.success('', "Delete Successful");
        this.roleTableObj.draw();
      },
      (error) => {
        console.error("Error occurred while deleting the role:", error);
        this.toastr.warning('', "Error occurred while deleting the role");
      }
    );
  }

  activeInactive() {
    if (!this.selectedRole || !this.selectedRole.id) {
      this.toastr.warning('Please select a Role to activate/inactivate.');
      return;
    }

    const isCurrentlyActive = this.selectedRole.activeStatus === '1' || this.selectedRole.activeStatus === 1;
    const action = isCurrentlyActive ? 'inactivate' : 'activate';

    const initialState = {
      title: `Do you want to ${action} this role?`,
      message: `Are you sure you want to ${action} the role "${this.selectedRole.roleName}"?`
    };

    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm'
    });

    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.updateActiveStatus(this.selectedRole.id, isCurrentlyActive ? 0 : 1);
      }
    });
  }

  private updateActiveStatus(id: number, activeStatus: number) {
    const payload = { id, activeStatus };

    this.roleService.updateRoleActiveInactive(payload).subscribe(
      (response: any) => {
        if (response && response.success) {
          this.toastr.success(`Role ${activeStatus === 1 ? 'activated' : 'inactivated'} successfully.`);
          this.roleTableObj.draw();

          if (this.selectedRole) {
            this.selectedRole.activeStatus = activeStatus;
            this.roleViewObj.activeStat = activeStatus;
          }
        } else {
          this.toastr.error(`Failed to ${activeStatus === 1 ? 'activate' : 'inactivate'} role.`);
        }
      },
      (error) => {
        console.error('Error updating Role status:', error);
        this.toastr.error('Error occurred while updating role status.');
      }
    );
  }

  onStatusChange(status: string) {
    this.activeStatus = status;
    if (this.roleTableObj) {
      this.roleTableObj.draw();
    }
  }

  onChangeRadioButton() {
    this.roleTableObj.draw();

    this.selectedRole = null;
    this.resetRoleViewObj();
  }

  getSelectedRole(data: any): void {
    this.selectedRole = data;
    this.roleViewObj = {
      roleId: data.roleId || '',
      roleName: data.roleName || '',
      activeStat: data.activeStatus || 0
    };
    console.log("Selected Role Data:", this.selectedRole);
  }

  resetRoleViewObj(): void {
    this.roleViewObj = {
      roleId: '',
      roleName: '',
      activeStat: 0
    };
  }

  // Data Grid
  initRoleGrid() {
    let that = this;
    this.roleTable = $(this.roleGrid.nativeElement);
    this.roleTableObj = this.roleTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url: environment.baseUrl + environment.authApiUrl + '/api/role/gridList',
        type: "GET",
        data: function (sendData: any) {
          sendData.activeStatus = that.activeStatus;
        },
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader('Authorization', "bearer " + that.authService.getAccessToken());
          xhr.setRequestHeader('Content-Type', "application/json");
        },
        dataSrc: function (response: any) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: any) {
          console.log("Data Grid Rendering Error", request.responseText);
        }
      },
      "order": [[0, "asc"]],
      columns: [
        {
          title: 'Role ID.',
          data: 'roleId',
          name: 'roleId'
        }, {
          title: 'Role Name',
          data: 'roleName',
          name: 'roleName'
        }, {
          title: 'Description',
          data: 'descr',
        },

        {
          title: 'Active Status',
          width: '40px',
          data: 'activeStatus',
          className: 'text-center',
          render: (data: any) => {
            if (data == '1') {
              return '<i class="fas fa-check text-success"></i>'
            }
            else {
              return '';
            }
          }
        },

        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            return data == 1 ? '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>' : '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
          }
        }
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedRole = data;
          that.getSelectedRole(data);
          console.log("Selected Role ", self.selectedRole);
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');

          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');

          }
        });
        return row;
      },
    })
  }

}
