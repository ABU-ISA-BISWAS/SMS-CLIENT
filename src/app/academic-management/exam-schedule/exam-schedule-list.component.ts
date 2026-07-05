import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth/_service/auth-service';
import { ConfirmationDialog } from '../../shared/component/confirmation-dialog/confirmation-dialog';
import {
  ExamRoutineModel,
  ExamScheduleModel,
} from '../_coreAcademicMangement/models/exam-schedule.model';
import { ExamScheduleService } from '../_coreAcademicMangement/services/exam-schedule.service';

@Component({
  selector: 'app-exam-schedule-list',
  templateUrl: './exam-schedule-list.component.html',
  styleUrls: ['./exam-schedule-list.component.css'],
  standalone: false,
})
export class ExamScheduleListComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('examGrid', { static: false })
  examGrid!: ElementRef;

  bsModalRef!: BsModalRef;
  examTable: any;
  examTableObj: any;

  // ── Dropdowns ─────────────────────────────────────────
  sessionList: any[] = [];
  classList: any[] = [];
  examTypeList: any[] = [];
  subjectList: any[] = [];
  roomList: any[] = [];

  // ── Filter ────────────────────────────────────────────
  filterSessionNo: number | null = null;
  filterClassNo: number | null = null;
  filterExamTypeNo: number | null = null;

  // ── Form ──────────────────────────────────────────────
  isFormVisible = false;
  formMode: 'add' | 'edit' | 'routine' = 'add';

  schedule = new ExamScheduleModel();
  isSaving = false;

  // ── Routine Form ──────────────────────────────────────
  routineList: ExamRoutineModel[] = [];
  savedRoutineList: any[] = [];
  isRoutineLoading = false;
  isRoutineSaving = false;
  selectedSchedule: any = null;

  // ── Selected row ──────────────────────────────────────
  selectedRow: any = null;

  statusOptions = [
    { value: 'DRAFT', label: 'Draft', cls: 'st-draft' },
    { value: 'PUBLISHED', label: 'Published', cls: 'st-published' },
    { value: 'ONGOING', label: 'Ongoing', cls: 'st-ongoing' },
    { value: 'COMPLETED', label: 'Completed', cls: 'st-completed' },
  ];

  constructor(
    private examService: ExamScheduleService,
    private modalService: BsModalService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {}

  ngOnInit() {
    this.loadDropdowns();
  }

  ngAfterViewInit() {
    this.initGrid();
  }

  loadDropdowns() {
    forkJoin({
      sessions: this.examService.getAllSessions(),
      classes: this.examService.getAllClasses(),
      examTypes: this.examService.getAllExamTypes(),
      rooms: this.examService.getAllRooms(),
    }).subscribe({
      next: (res: any) => {
        console.log('res::::', res);
        this.sessionList = res.sessions.items || [];
        this.classList = res.classes.items || [];
        this.examTypeList = res.examTypes.items || [];
        this.roomList = res.rooms.items || [];
      },
    });

    console.log('session::::', this.sessionList);
  }

  // ── Form Open/Close ───────────────────────────────────
  openForm(mode: 'add' | 'edit') {
    if (mode === 'edit') {
      if (!this.selectedRow) {
        this.toastr.warning('Please select a record to edit.');
        return;
      }
    }

    this.formMode = mode;
    this.schedule = new ExamScheduleModel();

    if (mode === 'edit' && this.selectedRow) {
      this.examService.find(this.selectedRow.examScheduleNo).subscribe({
        next: (res: any) => {
          if (res.success && res.obj) {
            Object.assign(this.schedule, res.obj);
          }
        },
      });
    }

    this.isFormVisible = true;
    if (this.examTableObj) {
      this.examTableObj.destroy();
      this.examTableObj = null;
    }
  }

  closeForm() {
    this.isFormVisible = false;
    this.formMode = 'add';
    this.schedule = new ExamScheduleModel();
    this.routineList = [];
    this.savedRoutineList = [];
    this.selectedSchedule = null;
    this.isSaving = false;
    setTimeout(() => this.initGrid(), 50);
  }

  // ── Save Schedule ─────────────────────────────────────
  saveSchedule() {
    if (!this.schedule.examScheduleName?.trim()) {
      this.toastr.warning("Exam name can't be empty!");
      return;
    }
    if (!this.schedule.examTypeNo) {
      this.toastr.warning('Please select Exam Type.');
      return;
    }
    if (!this.schedule.academicSessionNo) {
      this.toastr.warning('Please select Session.');
      return;
    }
    if (!this.schedule.classMasterNo) {
      this.toastr.warning('Please select Class.');
      return;
    }
    if (!this.schedule.examStartDate || !this.schedule.examEndDate) {
      this.toastr.warning('Please set exam date range.');
      return;
    }

    this.isSaving = true;

    const req$ = this.schedule.examScheduleNo
      ? this.examService.update(this.schedule)
      : this.examService.save(this.schedule);

    req$.pipe(finalize(() => (this.isSaving = false))).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastr.success(res.message || 'Saved successfully!');
          // Save করার পরে Routine form এ যাই
          if (!this.schedule.examScheduleNo && res.obj?.examScheduleNo) {
            this.schedule.examScheduleNo = res.obj.examScheduleNo;
          }
          this.openRoutineForm(this.schedule);
        } else {
          this.toastr.warning(res.message || 'Save failed.');
        }
      },
      error: () => this.toastr.error('Something went wrong.'),
    });
  }

  // ── Routine Form ──────────────────────────────────────
  openRoutineForm(row: any) {
    this.selectedSchedule = row;
    this.formMode = 'routine';
    this.routineList = [];
    this.savedRoutineList = [];

    if (!row.classMasterNo && !this.schedule.classMasterNo) return;

    const classNo = row.classMasterNo || this.schedule.classMasterNo;

    this.isRoutineLoading = true;

    forkJoin({
      subjects: this.examService.getSubjectsByClass(classNo),
      routine: this.examService.getRoutineList(
        row.examScheduleNo || this.schedule.examScheduleNo!,
      ),
    }).subscribe({
      next: (res: any) => {
        this.isRoutineLoading = false;
        this.subjectList = res.subjects || [];
        this.savedRoutineList = res.routine || [];

        // Subject list থেকে routine rows তৈরি করুন
        this.routineList = this.subjectList.map((sub: any) => {
          // Already saved routine আছে কিনা check করুন
          const saved = this.savedRoutineList.find(
            (r: any) => r.subjectNo === sub.id,
          );
          const entry = new ExamRoutineModel();
          entry.examScheduleNo =
            row.examScheduleNo || this.schedule.examScheduleNo;
          entry.subjectNo = sub.id;
          entry.subjectName = sub.subjectName;
          entry.subjectCode = sub.subjectCode;
          if (saved) {
            entry.examRoutineNo = saved.examRoutineNo;
            entry.examDate = saved.examDate;
            entry.startTime = saved.startTime || '09:00';
            entry.endTime = saved.endTime || '12:00';
            entry.durationMinutes = saved.durationMinutes || 180;
            entry.roomNo = saved.roomNo;
            entry.fullMarks = saved.fullMarks || 100;
            entry.passMarks = saved.passMarks || 33;
            entry.mcqMarks = saved.mcqMarks;
            entry.writtenMarks = saved.writtenMarks;
            entry.practicalMarks = saved.practicalMarks;
            entry.remarks = saved.remarks || '';
          }
          return entry;
        });
      },
      error: () => {
        this.isRoutineLoading = false;
        this.toastr.error('Failed to load subjects.');
      },
    });
  }

  // ── Save Routine ──────────────────────────────────────
  saveRoutine() {
    const scheduleNo =
      this.selectedSchedule?.examScheduleNo || this.schedule.examScheduleNo;

    if (!scheduleNo) {
      this.toastr.warning('Exam schedule not found.');
      return;
    }

    const routineData = this.routineList
      .filter((r) => r.examDate) // date set আছে এমনগুলোই save হবে
      .map((r) => ({
        subjectNo: r.subjectNo,
        examDate: r.examDate,
        startTime: r.startTime,
        endTime: r.endTime,
        durationMinutes: r.durationMinutes,
        roomNo: r.roomNo,
        fullMarks: r.fullMarks,
        passMarks: r.passMarks,
        mcqMarks: r.mcqMarks,
        writtenMarks: r.writtenMarks,
        practicalMarks: r.practicalMarks,
        remarks: r.remarks,
      }));

    if (routineData.length === 0) {
      this.toastr.warning('Please set exam date for at least one subject.');
      return;
    }

    this.isRoutineSaving = true;

    const payload = {
      examScheduleNo: scheduleNo,
      routineList: routineData,
    };

    this.examService
      .saveRoutine(payload)
      .pipe(finalize(() => (this.isRoutineSaving = false)))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success(res.message || 'Routine saved successfully!');
            this.closeForm();
          } else {
            this.toastr.warning(res.message || 'Save failed.');
          }
        },
        error: () => this.toastr.error('Something went wrong.'),
      });
  }

  // ── Status Change ─────────────────────────────────────
  changeStatus(newStatus: string) {
    if (!this.selectedRow) {
      this.toastr.warning('Please select a record first.');
      return;
    }

    const initialState = {
      title: `Change status to "${newStatus}"?`,
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((ok: boolean) => {
      if (!ok) return;
      this.examService
        .updateStatus({
          examScheduleNo: this.selectedRow.examScheduleNo,
          status: newStatus,
        })
        .subscribe({
          next: (res: any) => {
            if (res.success) {
              this.toastr.success(res.message || 'Status updated!');
              this.examTableObj?.draw();
              this.selectedRow = null;
            } else {
              this.toastr.warning(res.message || 'Failed.');
            }
          },
        });
    });
  }

  // ── Delete ────────────────────────────────────────────
  deleteSchedule() {
    if (!this.selectedRow) {
      this.toastr.warning('Please select a record to delete.');
      return;
    }

    const initialState = {
      title: 'Do you want to delete this exam schedule?',
    };
    this.bsModalRef = this.modalService.show(ConfirmationDialog, {
      initialState,
      class: 'modal-sm base-modal',
    });
    this.bsModalRef.content.onClose.subscribe((ok: boolean) => {
      if (!ok) return;
      this.examService.delete(this.selectedRow.examScheduleNo).subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success('Deleted successfully!');
            this.selectedRow = null;
            this.examTableObj?.draw();
          } else {
            this.toastr.warning(res.message || 'Delete failed.');
          }
        },
      });
    });
  }

  // ── Helpers ───────────────────────────────────────────
  getStatusClass(status: string): string {
    const map: any = {
      DRAFT: 'st-draft',
      PUBLISHED: 'st-published',
      ONGOING: 'st-ongoing',
      COMPLETED: 'st-completed',
    };
    return map[status] || 'st-draft';
  }

  getStatusLabel(status: string): string {
    const map: any = {
      DRAFT: 'Draft',
      PUBLISHED: 'Published',
      ONGOING: 'Ongoing',
      COMPLETED: 'Completed',
    };
    return map[status] || status;
  }

  // ── DataTable ─────────────────────────────────────────
  initGrid() {
    if (!this.examGrid?.nativeElement) return;
    const that = this;

    this.examTable = $(this.examGrid.nativeElement);
    this.examTableObj = this.examTable.DataTable({
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: {
        url:
          environment.baseUrl +
          environment.academicManagementApiUrl +
          '/api/exam-schedule/gridList',
        type: 'GET',
        data: function (d: any) {
          d.sessionNo = that.filterSessionNo || '';
          d.classNo = that.filterClassNo || '';
          d.examTypeNo = that.filterExamTypeNo || '';
          return d;
        },
        beforeSend: function (xhr: any) {
          xhr.setRequestHeader(
            'Authorization',
            'bearer ' + that.authService.getAccessToken(),
          );
        },
        dataSrc: function (res: any) {
          res.draw = res.obj.draw;
          res.recordsTotal = res.obj.recordsTotal;
          res.recordsFiltered = res.obj.recordsFiltered;
          return res.obj.data;
        },
      },
      order: [[0, 'desc']],
      columns: [
        {
          title: 'Exam Name',
          data: 'examScheduleName',
          render: (_: any, __: any, row: any) =>
            `<div style="font-size:12px;font-weight:500">${row.examScheduleName}</div>
             <div style="font-size:11px;color:#888">${row.examTypeCode || ''}</div>`,
        },
        { title: 'Session', data: 'sessionName', width: '120px' },
        { title: 'Class', data: 'className', width: '100px' },
        {
          title: 'Exam Period',
          data: 'examStartDate',
          width: '160px',
          render: (_: any, __: any, row: any) =>
            `<span style="font-size:11px">
               ${row.examStartDate || '—'}
               &nbsp;→&nbsp;
               ${row.examEndDate || '—'}
             </span>`,
        },
        {
          title: 'Status',
          data: 'status',
          width: '100px',
          render: (data: string) =>
            `<span class="exam-status ${that.getStatusClass(data)}">
               ${that.getStatusLabel(data)}
             </span>`,
        },
      ],
      responsive: true,
      autoWidth: false,
      rowCallback: (row: Node, data: any) => {
        $('td', row)
          .off('click')
          .on('click', () => {
            if ($(row).hasClass('selected-row')) {
              $(row).removeClass('selected-row');
              this.selectedRow = null;
            } else {
              $(row).closest('tbody').find('tr').removeClass('selected-row');
              $(row).addClass('selected-row');
              this.selectedRow = data;
            }
          });
        return row;
      },
    });
  }

  ngOnDestroy() {
    if (this.bsModalRef) this.bsModalRef.hide();
  }
}
