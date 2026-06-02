import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { SubjectMaster } from '../../_coreSecurity/models/subject-master.model';
import { ModuleService } from '../../_coreSecurity/services/module.service';
import { SubjectMasterService } from '../../_coreSecurity/services/subject-master.service';
import { AddSubjectComponent } from './add-subject/add-subject.component';

@Component({
  selector: 'app-subject-master',
  templateUrl: './subject-master.component.html',
  styleUrls: ['./subject-master.component.css'],
  standalone: false,
})
export class SubjectMasterComponent implements OnInit {
  bsModalRef!: BsModalRef;
  subjectTable: any;
  subjectTableObj: any;
  selectedSubject!: any;
  selectedSubjectId!: number;
  @ViewChild('subjectGrid')
  subjectGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private moduleService: ModuleService,
    private toastr: ToastrService,
    private subjectMasterService: SubjectMasterService,
  ) {}

  ngOnInit() {
    this.initSubjectGrid();
  }

  ngAfterViewInit(): void {
    this.initSubjectGrid();
  }

  addSubject() {
    const initialState = {
      title: 'Add Subject',
    };
    this.bsModalRef = this.modalService.show(AddSubjectComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.subjectTableObj.draw();
      }
    });
  }
  editSubject() {
    if (!this.selectedSubject) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Subject',
        subject: this.selectedSubject,
      };
      this.bsModalRef = this.modalService.show(AddSubjectComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.subjectTableObj.draw();
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
  //     this.bsModalRef = this.modalService.show(ConfirmationDialog, { initialState, Subject: 'modal-sm base-modal' });
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
  disableOrEnableSubject(): void {
    if (!this.selectedSubject) {
      this.toastr.warning('Please select a Subject first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this Subject?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedSubject.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.subjectMasterService
            .updateSubject(this.selectedSubject)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.subjectTableObj.draw();
            });
        }
      });
    }
  }

  initSubjectGrid() {
    let that = this;
    this.subjectTable = $(this.subjectGrid?.nativeElement);
    this.subjectTableObj = this.subjectTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/subject-master/gridList',
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
          title: 'Subject No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Subject Code',
          data: 'subjectCode',
          className: 'dt-left',
        },
        {
          title: 'Subject Name',
          data: 'subjectName',
          name: 'subjectName',
        },
        {
          title: 'Subject Name Bangla',
          data: 'subjectNameBn',
          name: 'subjectNameBn',
        },
        {
          title: 'Subject Type',
          data: 'subjectType',
          name: 'subjectType',
        },

        {
          title: 'Subject Category',
          data: 'subjectCategory',
          name: 'subjectCategory',
        },

        {
          title: 'Credit Hour',
          data: 'creditHour',
          className: 'dt-left',
        },
        {
          title: 'Full Marks',
          data: 'fullMarks',
          className: 'dt-left',
        },
        {
          title: 'Status',
          data: 'activeStatus',
          render: (data: number) => {
            if (data == 1) {
              return '<span Subject="badge rounded-pill bg-success-subtle px-3 py-2 text-success">Active</span>';
            } else {
              return '<span Subject="badge rounded-pill bg-danger-subtle px-3 py-2 text-danger">Inactive</span>';
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
          this.selectedSubject = data.id;

          if (self.selectedSubject) {
            self.selectedSubject = null;
          }
          self.selectedSubject = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.subjectMasterService
            .getSingleSubject(data.id)
            .subscribe((res: SubjectMaster) => {
              this.selectedSubject = res;
            });
          console.log('Selected Subject ', this.selectedSubject);
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
    this.subjectTableObj.draw();
  }
}
