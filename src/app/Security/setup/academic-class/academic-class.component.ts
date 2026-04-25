import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { AcademicClass } from '../../_coreSecurity/models/academic-class.model';
import { AcademicClassService } from '../../_coreSecurity/services/academic-class.service';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { AddClassComponent } from './add-class/add-class.component';

@Component({
  selector: 'app-academic-class',
  templateUrl: './academic-class.component.html',
  styleUrls: ['./academic-class.component.css'],
  standalone: false,
})
export class AcademicClassComponent implements OnInit {
  bsModalRef!: BsModalRef;
  academicClassTable: any;
  academicClassTableObj: any;
  selectedClass!: any;
  selectedClassId!: number;
  @ViewChild('academicClassGrid')
  academicClassGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private academicClassService: AcademicClassService,
  ) {}

  ngOnInit() {
    this.initAcademicClassGrid();
  }

  ngAfterViewInit(): void {
    this.initAcademicClassGrid();
  }

  addClass() {
    const initialState = {
      title: 'Add Class',
    };
    this.bsModalRef = this.modalService.show(AddClassComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.academicClassTableObj.draw();
      }
    });
  }
  editClass() {
    if (!this.selectedClass) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Class',
        academicClass: this.selectedClass,
      };
      this.bsModalRef = this.modalService.show(AddClassComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.academicClassTableObj.draw();
        }
      });
    }
  }
  // deleteFeature(): void {
  //   if (!this.selectedFeature) {
  //     this.toastr.warning("Please select a record to Delete")
  //   }
  //   else {
  //     const initialState = { title: "Do you want to Delete?" };
  //     this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, class: 'modal-sm base-modal' });
  //     this.bsModalRef.content.onClose.subscribe((result: any) => {
  //       if (result) {
  //         this.featureService.deleteFeature(this.selectedFeature.id).subscribe((res: { message: string | undefined; }) => {
  //           res.message ? this.toastr.success(res.message) : this.toastr.warning(res.message);
  //           this.featureTableObj.draw();
  //         })
  //       }
  //     })
  //   }
  // }
  disableOrEnableClass(): void {
    if (!this.selectedClass) {
      this.toastr.warning('Please select a class first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this class?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedClass.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.academicClassService
            .updateClass(this.selectedClass)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.academicClassTableObj.draw();
            });
        }
      });
    }
  }

  initAcademicClassGrid() {
    let that = this;
    this.academicClassTable = $(this.academicClassGrid?.nativeElement);
    this.academicClassTableObj = this.academicClassTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl + environment.authApiUrl + '/api/class/gridList',
        type: 'GET',
        data: function (d: any) {
          d.customSearch = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          return d;
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
          title: 'Academic Class No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Class Name',
          data: 'className',
          name: 'className',
        },
        {
          title: 'Class Code',
          data: 'classCode',
          className: 'dt-left',
        },
        {
          title: 'Class Order',
          data: 'classOrder',
          className: 'dt-left',
        },
        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            if (data == 1) {
              return '<span class="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>';
            } else {
              return '<span class="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
            }
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
          this.selectedClass = data.id;

          if (self.selectedClass) {
            self.selectedClass = null;
          }
          self.selectedClass = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.academicClassService
            .getSingleClass(data.id)
            .subscribe((res: AcademicClass) => {
              this.selectedClass = res;
            });
          console.log('Selected class ', this.selectedClass);
        });
        return row;
      },
    });
  }

  statusCheck(status: string) {
    this.activeInactiveFlag = status;
    if (this.activeInactiveFlag == 'A') {
      this.disableButton = 'Disable';
    } else {
      this.disableButton = 'Enable';
    }
    this.academicClassTableObj.draw();
  }
}
