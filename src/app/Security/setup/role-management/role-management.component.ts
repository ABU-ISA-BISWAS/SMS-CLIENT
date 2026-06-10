import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { RoleService } from '../../_coreSecurity/services/role.service';
import { AddRoleNewComponent } from './add-role-new/add-role-new.component';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css'],
  standalone: false,
})
export class RoleManagementComponent implements OnInit, AfterViewInit {
  @ViewChild('roleGrid') roleGrid!: { nativeElement: any };
  @ViewChild('addRoleRef') addRoleRef!: AddRoleNewComponent;

  bsModalRef!: BsModalRef;
  bsModalRefDel!: BsModalRef;
  roleTable: any;
  roleTableObj: any;
  selectedRole: any;
  disableButton: string = 'Disable';
  activeStatus = '1';
  enabledDisabledFlag: string = 'E';
  roleViewObj: any = { roleId: '', roleName: '', activeStat: 0 };

  // ── Inline flip state ─────────────────────────────────────
  isFlipped: boolean = false;
  formTitle: string = '';
  formSelectedRole: any = null;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private roleService: RoleService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initRoleGrid();
  }

  // ── Inline form helpers ───────────────────────────────────

  addRole() {
    this.formTitle = 'Add Role';
    this.formSelectedRole = null;
    this.isFlipped = true;
  }

  editRole() {
    if (!this.selectedRole) {
      this.toastr.warning('No role selected for editing.');
      return;
    }
    this.formTitle = 'Edit Role';
    this.formSelectedRole = this.selectedRole;
    this.isFlipped = true;
  }

  closeForm() {
    this.isFlipped = false;
    this.formSelectedRole = null;
  }

  triggerSave() {
    if (this.addRoleRef) {
      this.addRoleRef.saveUpdateRole();
    }
  }

  onFormSaved() {
    this.isFlipped = false;
    this.formSelectedRole = null;
    this.selectedRole = null;
    this.resetRoleViewObj();
    this.roleTableObj?.draw();
  }

  // ── Existing logic (unchanged) ────────────────────────────

  onDeleteModal() {
    if (!this.selectedRole) {
      this.toastr.warning('Please Select a Role!');
      return;
    }
    const initialState = {
      title: 'Do you want to Delete?',
      message: `Role: ${this.selectedRole.roleName}`,
    };
    this.bsModalRefDel = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm',
      backdrop: 'static',
    });
    this.bsModalRefDel.content.onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteRole();
      }
    });
  }

  deleteRole() {
    if (!this.selectedRole?.id) {
      this.toastr.warning('Invalid Role Selected!');
      return;
    }
    this.roleService.deleteRole(this.selectedRole.id).subscribe(
      () => {
        this.toastr.success('', 'Delete Successful');
        this.roleTableObj.draw();
      },
      (error) => {
        console.error('Error deleting role:', error);
        this.toastr.warning('', 'Error occurred while deleting the role');
      },
    );
  }

  activeInactive() {
    if (!this.selectedRole?.id) {
      this.toastr.warning('Please select a Role to activate/inactivate.');
      return;
    }
    const isActive =
      this.selectedRole.activeStatus === '1' ||
      this.selectedRole.activeStatus === 1;
    const action = isActive ? 'inactivate' : 'activate';
    const initialState = {
      title: `Do you want to ${action} this role?`,
      message: `Are you sure you want to ${action} the role "${this.selectedRole.roleName}"?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.updateActiveStatus(this.selectedRole.id, isActive ? 0 : 1);
      }
    });
  }

  private updateActiveStatus(id: number, activeStatus: number) {
    this.roleService.updateRoleActiveInactive({ id, activeStatus }).subscribe(
      (response: any) => {
        if (response?.success) {
          this.toastr.success(
            `Role ${activeStatus === 1 ? 'activated' : 'inactivated'} successfully.`,
          );
          this.roleTableObj.draw();
          if (this.selectedRole) {
            this.selectedRole.activeStatus = activeStatus;
            this.roleViewObj.activeStat = activeStatus;
          }
        } else {
          this.toastr.error(
            `Failed to ${activeStatus === 1 ? 'activate' : 'inactivate'} role.`,
          );
        }
      },
      (error) => {
        console.error('Error updating role status:', error);
        this.toastr.error('Error occurred while updating role status.');
      },
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
      activeStat: data.activeStatus || 0,
    };
  }

  resetRoleViewObj(): void {
    this.roleViewObj = { roleId: '', roleName: '', activeStat: 0 };
  }

  initRoleGrid() {
    let that = this;
    this.roleTable = $(this.roleGrid.nativeElement);
    this.roleTableObj = this.roleTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl + environment.authApiUrl + '/api/role/gridList',
        type: 'GET',
        data: function (sendData: any) {
          sendData.activeStatus = that.activeStatus;
        },
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
          xhr.setRequestHeader('Content-Type', 'application/json');
        },
        dataSrc: function (response: any) {
          response.draw = response.obj.draw;
          response.recordsTotal = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: function (request: any) {
          console.log('Data Grid Rendering Error', request.responseText);
        },
      },
      order: [[0, 'asc']],
      columns: [
        { title: 'Role ID.', data: 'roleId', name: 'roleId' },
        { title: 'Role Name', data: 'roleName', name: 'roleName' },
        { title: 'Description', data: 'descr' },
        {
          title: 'Active Status',
          width: '40px',
          data: 'activeStatus',
          className: 'text-center',
          render: (data: any) =>
            data == '1' ? '<i class="fas fa-check text-success"></i>' : '',
        },
        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) =>
            data == 1
              ? '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>'
              : '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>',
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any) => {
        $('td', row).off('click');
        $('td', row).on('click', () => {
          this.selectedRole = data;
          this.getSelectedRole(data);
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
        });
        return row;
      },
    });
  }
}
