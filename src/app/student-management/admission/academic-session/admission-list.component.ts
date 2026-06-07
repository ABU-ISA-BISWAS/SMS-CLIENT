import {
  Component, OnInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../auth/_service/auth-service'; 
import { environment } from '../../../../environments/environment'; 
import { AdmissionService } from '../../_coreStudentMangement/services/admission.service'; 
import { AdmissionDrawerComponent } from './admission-drawer/admission-drawer.component'; 
import { ConfirmationDialog } from '../../../shared/component/confirmation-dialog/confirmation-dialog'; 
import { AdmissionStatusUpdate } from '../../_coreStudentMangement/models/admission.model';

@Component({
  selector: 'app-admission-list',
  templateUrl: './admission-list.component.html',
  styleUrls: ['./admission-list.component.css'],
  standalone: false,
})
export class AdmissionListComponent implements OnInit, AfterViewInit {
  @ViewChild('admissionGrid') admissionGrid!: ElementRef;

  bsModalRef!: BsModalRef;
  admissionTable: any;
  admissionTableObj: any;
  selectedAdmission: any = null;

  // Filter
  sessionList: any[]  = [];
  classList: any[]    = [];
  filterSessionNo: number | null = null;
  filterClassNo: number | null   = null;
  activeInactiveFlag: string     = 'A';

  // Drawer state
  isDrawerOpen = false;
  drawerMode: 'add' | 'edit' = 'add';
  drawerAdmission: any = null;

  // Status change
  admissionStatusOptions = [
    { value: 'ACTIVE',      label: 'Active',      cls: 'badge-active' },
    { value: 'TC_ISSUED',   label: 'TC Issued',   cls: 'badge-tc' },
    { value: 'PASSED_OUT',  label: 'Passed Out',  cls: 'badge-passed' },
    { value: 'DROPOUT',     label: 'Dropout',     cls: 'badge-dropout' },
    { value: 'EXPELLED',    label: 'Expelled',    cls: 'badge-expelled' },
  ];

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private authService: AuthService,
    private admissionService: AdmissionService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadDropdowns();
  }

  ngAfterViewInit(): void {
    this.initGrid();
  }

  loadDropdowns() {
    this.admissionService.getAllSessions().subscribe({
      next: (res: any[]) => (this.sessionList = res || []),
    });
    this.admissionService.getAllClasses().subscribe({
      next: (res: any[]) => (this.classList = res || []),
    });
  }

  // ── Drawer ─────────────────────────────────────────────
  openAddDrawer() {
    this.drawerMode      = 'add';
    this.drawerAdmission = null;
    this.isDrawerOpen    = true;
  }

  openEditDrawer() {
    if (!this.selectedAdmission) {
      this.toastr.warning('Please select a student record to edit.');
      return;
    }
    this.drawerMode      = 'edit';
    this.drawerAdmission = this.selectedAdmission;
    this.isDrawerOpen    = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  onDrawerSaved() {
    this.isDrawerOpen = false;
    this.admissionTableObj.draw();
    this.toastr.success('Admission saved successfully!');
  }

  // ── Profile View ───────────────────────────────────────
  viewProfile() {
    if (!this.selectedAdmission) {
      this.toastr.warning('Please select a student first.');
      return;
    }
    this.router.navigate([
      '/student/admission/profile',
      this.selectedAdmission.admissionNo
    ]);
  }

  // ── Status Change ──────────────────────────────────────
  changeStatus(newStatus: string) {
    if (!this.selectedAdmission) {
      this.toastr.warning('Please select a student first.');
      return;
    }
    if (newStatus === 'TC_ISSUED') {
      this.openTcModal();
      return;
    }
    const initialState = {
      title: `Change status to "${newStatus}" for this student?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState, class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        const payload: AdmissionStatusUpdate = {
          admissionNo:     this.selectedAdmission.admissionNo,
          admissionStatus: newStatus,
          tcDate:          '',
          tcReason:        '',
        };
        this.admissionService.updateStatus(payload).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.admissionTableObj.draw();
          },
        });
      }
    });
  }

  openTcModal() {
    // TC Issue needs date + reason → small focused modal is fine here
    const initialState = {
      title: 'Issue Transfer Certificate',
      admission: this.selectedAdmission,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState, class: 'modal-md base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((result: any) => {
      if (result) {
        this.admissionService.updateStatus(result).subscribe({
          next: (res: any) => {
            res.success
              ? this.toastr.success(res.message)
              : this.toastr.warning(res.message);
            this.admissionTableObj.draw();
          },
        });
      }
    });
  }

  // ── Filter ─────────────────────────────────────────────
  applyFilter() { this.admissionTableObj.draw(); }

  clearFilter() {
    this.filterSessionNo = null;
    this.filterClassNo   = null;
    this.admissionTableObj.draw();
  }

  // ── DataTable ──────────────────────────────────────────
  initGrid() {
    const that = this;
    this.admissionTableObj = $(this.admissionGrid.nativeElement).DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url: `${environment.baseUrl}${environment.authApiUrl}/api/admission/gridList`,
        type: 'GET',
        data: (d: any) => {
          d.customSearch      = d.search.value;
          d.activeInactiveFlag = that.activeInactiveFlag;
          d.academicSessionNo = that.filterSessionNo || '';
          d.classMasterNo     = that.filterClassNo   || '';
          return d;
        },
        beforeSend: (xhr: any) => {
          xhr.setRequestHeader('Authorization',
            'bearer ' + that.authService.getAccessToken());
        },
        dataSrc: (response: any) => {
          response.draw            = response.obj.draw;
          response.recordsTotal    = response.obj.recordsTotal;
          response.recordsFiltered = response.obj.recordsFiltered;
          return response.obj.data;
        },
        error: (req: any) => console.error('Grid Error', req.responseText),
      },
      order: [[0, 'desc']],
      columns: [
        { title: '#', data: 'admissionNo', width: '50px' },
        {
          title: 'Student',
          data: 'fullName',
          render: (data: string, _: any, row: any) =>
            `<div class="student-cell">
              <div class="student-avatar">${data.charAt(0).toUpperCase()}</div>
              <div>
                <div class="student-name">${data}</div>
                <div class="student-meta">${row.studentCode}</div>
              </div>
            </div>`,
        },
        { title: 'Reg. No', data: 'admissionRegNo' },
        { title: 'Class', data: 'className' },
        { title: 'Section', data: 'sectionName' },
        { title: 'Roll', data: 'rollNo' },
        { title: 'Guardian Mobile', data: 'guardianMobile' },
        {
          title: 'Type',
          data: 'admissionType',
          render: (data: string) => {
            const map: any = {
              NEW:          'tag-new',
              TRANSFER:     'tag-transfer',
              RE_ADMISSION: 'tag-readmit',
            };
            return `<span class="adm-tag ${map[data] || ''}">${data}</span>`;
          },
        },
        {
          title: 'Status',
          data: 'admissionStatus',
          render: (data: string) => {
            const map: any = {
              ACTIVE:      'status-active',
              TC_ISSUED:   'status-tc',
              PASSED_OUT:  'status-passed',
              DROPOUT:     'status-dropout',
              EXPELLED:    'status-expelled',
            };
            const labels: any = {
              ACTIVE: 'Active', TC_ISSUED: 'TC Issued',
              PASSED_OUT: 'Passed Out', DROPOUT: 'Dropout', EXPELLED: 'Expelled',
            };
            return `<span class="status-pill ${map[data] || ''}">${labels[data] || data}</span>`;
          },
        },
      ],

      responsive: true,
      autoWidth: false,
      rowCallback: (row: Node, data: any) => {
        $('td', row).off('click').on('click', () => {
          if ($(row).hasClass('selected-row')) {
            $(row).removeClass('selected-row');
            this.selectedAdmission = null;
          } else {
            $(row).closest('tbody').find('tr').removeClass('selected-row');
            $(row).addClass('selected-row');
            this.admissionService.getSingle(data.admissionNo).subscribe(
              (res: any) => (this.selectedAdmission = res)
            );
          }
        });
        return row;
      },
    });
  }
}