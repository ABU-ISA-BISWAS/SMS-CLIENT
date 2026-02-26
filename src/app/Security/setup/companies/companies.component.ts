import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AddCompanyComponent } from './add-company/add-company.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  standalone: false,
})
export class CompaniesComponent implements OnInit {
  bsModalRef!: BsModalRef;
  companyTable: any;
  @ViewChild('companyGrid') companyGrid!: { nativeElement: any };
  companyTableObj!: DataTables.Api;

  selectedCompany: any;
  onClose!: Subject<boolean>;

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initCompanyGrid();
  }

  addCompany() {
    const initialState = {
      title: 'Add Company',
    };
    this.bsModalRef = this.modalService.show(AddCompanyComponent, {
      class: 'modal-md',
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      if (result == true) {
        this.companyTableObj.draw();
      }
    });
  }
  editCompany() {
    if (!this.selectedCompany) {
      this.toastr.warning('Please select company first');
    } else {
      const initialState = {
        title: 'Edit Company',
        sendCompany: this.selectedCompany,
      };
      this.bsModalRef = this.modalService.show(AddCompanyComponent, {
        class: 'modal-md',
        initialState,
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result == true) {
          this.companyTableObj.draw();
        }
      });
    }
  }
  deleteCompany(): void {
    const initialState = { title: 'Do you want to Delete?' };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm',
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      console.log('lets do further processing here: ', result);
    });
  }

  // Data Grid
  initCompanyGrid() {
    let that = this;
    this.companyTable = $(this.companyGrid.nativeElement);
    this.companyTableObj = this.companyTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/company/gridList',
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
          title: 'Company ID.',
          data: 'id',
        },
        {
          title: 'Company Name',
          data: 'companyName',
          name: 'companyName',
        },
        {
          title: 'Address',
          data: 'companyAddress1',
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
          self.selectedCompany = data;
          console.log('Selected Company ', self.selectedCompany);
        });
        return row;
      },
    });
  }
}
