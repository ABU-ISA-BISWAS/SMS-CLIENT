import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AddOrganizationComponent } from './add-organization/add-organization.component';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
  standalone: false,
})
export class OrganizationsComponent implements OnInit {
  @ViewChild('orgGrid') orgGrid!: { nativeElement: any };
  bsModalRef!: BsModalRef;
  selectedOrg: any;
  orgTable: any;
  orgTableObj!: DataTables.Api;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initOrgGrid();
  }

  addOrg() {
    const initialState = { title: 'Add Organization' };
    this.bsModalRef = this.modalService.show(AddOrganizationComponent, {
      class: 'modal-md',
      initialState,
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      if (result == true) {
        this.orgTableObj.draw();
      }
    });
  }
  editOrg() {
    if (!this.selectedOrg) {
      this.toastr.warning('Please select company first');
    } else {
      const initialState = {
        title: 'Edit Organization',
        sendOrg: this.selectedOrg,
      };
      this.bsModalRef = this.modalService.show(AddOrganizationComponent, {
        class: 'modal-md',
        initialState,
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result == true) {
          this.orgTableObj.draw();
        }
      });
    }
  }
  deleteOrg(): void {
    const initialState = {
      title: 'Do you want to Delete?',
      data: this.selectedOrg,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm',
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      console.log('lets do further processing here: ', result);
    });
  }

  // Data Grid
  initOrgGrid() {
    let that = this;
    this.orgTable = $(this.orgGrid.nativeElement);
    this.orgTableObj = this.orgTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url: environment.baseUrl + environment.authApiUrl + '/api/org/gridList',
        type: 'GET',
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
      order: [[0, 'asc']],
      columns: [
        {
          title: 'Org. ID.',
          data: 'id',
        },
        {
          title: 'Org. Name',
          data: 'ogName',
          name: 'ogName',
        },
        {
          title: 'Address',
          data: 'ogAddress',
        },
        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            return data == 1 ? 'Active' : 'Inactive';
          },
        },
      ],
      select: true,
      responsive: true,
      autoWidth: true,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          self.selectedOrg = data;
          console.log('Selected Organization ', self.selectedOrg);
        });
        return row;
      },
    });
  }
}
