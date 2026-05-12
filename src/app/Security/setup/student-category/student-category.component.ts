import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog';
import { StudentCategory } from '../../_coreSecurity/models/student-category.model'; 
import { StudentCategoryService } from '../../_coreSecurity/services/student-category.service'; 
import { AddStudentCategoryComponent } from './add-student-category/add-student-category.component'; 

@Component({
  selector: 'app-student-category',
  templateUrl: './student-category.component.html',
  styleUrls: ['./student-category.component.css'],
  standalone: false,
})
export class StudentCategoryComponent implements OnInit {
  bsModalRef!: BsModalRef;
  studentCategoryTable: any;
  studentCategoryTableObj: any;
  selectedStudentCategory!: any;
  selectedStudentCategoryId!: number;
  @ViewChild('studentCategoryGrid')
  studentCategoryGrid!: { nativeElement: any };
  activeInactiveFlag: string | null = 'A';
  disableButton: string = 'Disable';

  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
    private studentCategoryService: StudentCategoryService,
  ) {}

  ngOnInit() {
    this.initStudentCategoryGrid();
  }

  ngAfterViewInit(): void {
    this.initStudentCategoryGrid();
  }

  addStudentCategory() {
    const initialState = {
      title: 'Add Student Category',
    };
    this.bsModalRef = this.modalService.show(AddStudentCategoryComponent, {
      class: 'modal-md base-modal',
      initialState,
      backdrop: 'static',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result == true) {
        this.studentCategoryTableObj.draw();
      }
    });
  }
  editStudentCategory() {
    if (!this.selectedStudentCategory) {
      this.toastr.warning('Please select a record to Edit');
    } else {
      const initialState = {
        title: 'Edit Student Category',
        studentCategory: this.selectedStudentCategory,
      };
      this.bsModalRef = this.modalService.show(AddStudentCategoryComponent, {
        class: 'modal-md base-modal',
        initialState,
        backdrop: 'static',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          this.studentCategoryTableObj.draw();
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
  disableOrEnableStudentCategory(): void {
    if (!this.selectedStudentCategory) {
      this.toastr.warning('Please select a student-category first.');
    } else {
      const initialState = {
        title: 'Do you want to ' + this.disableButton + ' this student-category?',
      };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: '',
      });
      this.bsModalRef.content.onClose.subscribe((result: boolean) => {
        if (result == true) {
          console.log('flag:', this.activeInactiveFlag);
          this.selectedStudentCategory.activeStatus =
            this.activeInactiveFlag == 'I' ? 1 : 0;
          this.studentCategoryService
            .updateStudentCategory(this.selectedStudentCategory)
            .subscribe((res: { message: string | undefined }) => {
              console.log('reees:', res);
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
              this.studentCategoryTableObj.draw();
            });
        }
      });
    }
  }

  initStudentCategoryGrid() {
    let that = this;
    this.studentCategoryTable = $(this.studentCategoryGrid?.nativeElement);
    this.studentCategoryTableObj = this.studentCategoryTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,

      ajax: {
        url:
          environment.baseUrl +
          environment.authApiUrl +
          '/api/student-category/gridList',
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
          title: 'Student Category No.',
          data: 'id',
          className: 'dt-left',
        },
        {
          title: 'Student Category Name',
          data: 'categoryName',
          name: 'categoryName',
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
          this.selectedStudentCategory = data.id;

          if (self.selectedStudentCategory) {
            self.selectedStudentCategory = null;
          }
          self.selectedStudentCategory = data;

          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
          }
          this.studentCategoryService
            .getSingleStudentCategory(data.id)
            .subscribe((res: StudentCategory) => {
              this.selectedStudentCategory = res;
            });
          console.log('Selected student-category ', this.selectedStudentCategory);
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
    this.studentCategoryTableObj.draw();
  }
}
