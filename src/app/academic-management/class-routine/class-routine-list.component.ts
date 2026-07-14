import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ConfirmationDialog } from '../../shared/component/confirmation-dialog/confirmation-dialog';
import {
  ClassRoutineEntry,
  ClassRoutineFilter,
} from '../_coreAcademicMangement/models/class-routine.model';
import { ClassRoutineService } from '../_coreAcademicMangement/services/class-routine.service';

@Component({
  selector: 'app-class-routine-list',
  templateUrl: './class-routine-list.component.html',
  styleUrls: ['./class-routine-list.component.css'],
  standalone: false,
})
export class ClassRoutineListComponent implements OnInit {
  // ── Dropdowns ─────────────────────────────────────────
  sessionList: any[] = [];
  classList: any[] = [];
  sectionList: any[] = [];
  shiftList: any[] = [];
  subjectList: any[] = [];
  teacherList: any[] = [];
  roomList: any[] = [];
  periodList: any[] = [];

  // ── Filter ────────────────────────────────────────────
  filter = new ClassRoutineFilter();

  // ── Timetable Grid ───────────────────────────────────
  // rows = periods, columns = days
  days = [
    { code: 1, name: 'Sunday' },
    { code: 2, name: 'Monday' },
    { code: 3, name: 'Tuesday' },
    { code: 4, name: 'Wednesday' },
    { code: 5, name: 'Thursday' },
    { code: 6, name: 'Friday' },
    { code: 7, name: 'Saturday' },
  ];

  // grid[periodNo][dayCode] = ClassRoutineEntry
  routineGrid: any = {};

  // ── State ─────────────────────────────────────────────
  isLoaded = false;
  isLoading = false;
  isSaving = false;
  isPrinting = false;

  // ── Cell Edit Modal ───────────────────────────────────
  isCellModalOpen = false;
  editingCell: ClassRoutineEntry = new ClassRoutineEntry();
  editingPeriodNo: number | null = null;
  editingDayCode: number | null = null;
  bsModalRef!: BsModalRef;
  constructor(
    private routineService: ClassRoutineService,
    private toastr: ToastrService,
    private modalService: BsModalService,
  ) {}

  ngOnInit() {
    this.loadDropdowns();
  }

  loadDropdowns() {
    forkJoin({
      sessions: this.routineService.getAllSessions(),
      classes: this.routineService.getAllClasses(),
      sections: this.routineService.getAllSections(),
      shifts: this.routineService.getAllShifts(),
      rooms: this.routineService.getAllRooms(),
      teachers: this.routineService.getTeachers(),
    }).subscribe({
      next: (res: any) => {
        console.log('res::::', res);
        this.sessionList = res.sessions?.items || [];
        this.classList = res.classes?.items || [];
        this.sectionList = res.sections?.items || [];
        this.shiftList = res.shifts?.items || [];
        this.roomList = res.rooms?.items || [];
        this.teacherList = res.teachers?.items || [];
      },
    });
  }

  onClassChange() {
    if (!this.filter.classMasterNo) return;
    this.routineService
      .getSubjectsByClass(this.filter.classMasterNo)
      .subscribe({
        next: (res: any) => {
          this.subjectList = res?.items || [];
        },
      });
  }

  onShiftChange() {
    if (this.filter.shiftMasterNo != null) {
      this.routineService.getPeriods(this.filter.shiftMasterNo).subscribe({
        next: (res: any) => {
          this.periodList = res?.items || [];
          this.buildEmptyGrid();
        },
      });
    }
  }

  // ── Load Routine ──────────────────────────────────────
  loadRoutine() {
    if (
      !this.filter.academicSessionNo ||
      !this.filter.classMasterNo ||
      !this.filter.shiftMasterNo
    ) {
      this.toastr.warning('Please select Session, Class and Shift.');
      return;
    }

    this.isLoading = true;
    this.isLoaded = false;
    this.buildEmptyGrid();

    forkJoin({
      routine: this.routineService.getRoutine(this.filter),
      periods: this.routineService.getPeriods(this.filter.shiftMasterNo),
      subjects: this.routineService.getSubjectsByClass(
        this.filter.classMasterNo!,
      ),
    }).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.periodList = res.periods?.items || [];
        this.subjectList = res.subjects?.items || [];
        this.buildEmptyGrid();

        // Fill grid with existing data
        const existingList: any[] = res.routine?.obj || [];
        existingList.forEach((item: any) => {
          const key = `${item.periodNo}_${item.dayCode}`;
          const entry = new ClassRoutineEntry();
          entry.classRoutineNo = item.classRoutineNo;
          entry.dayCode = item.dayCode;
          entry.dayName = item.dayName;
          entry.periodNo = item.periodNo;
          entry.subjectMasterNo = item.subjectMasterNo;
          entry.subjectName = item.subjectName;
          entry.employeeNo = item.employeeNo;
          entry.teacherName = item.teacherName;
          entry.roomNo = item.roomNo;
          entry.roomName = item.roomName;
          this.routineGrid[key] = entry;
        });

        this.isLoaded = true;
      },
      error: () => {
        this.isLoading = false;
        this.toastr.error('Failed to load routine.');
      },
    });
  }

  buildEmptyGrid() {
    this.routineGrid = {};
  }

  getCell(periodNo: number, dayCode: number): ClassRoutineEntry | null {
    return this.routineGrid[`${periodNo}_${dayCode}`] || null;
  }

  // ── Cell Click → Open Edit Modal ─────────────────────
  openCellModal(period: any, day: any) {
    this.editingPeriodNo = period.id;
    this.editingDayCode = day.code;

    const existing = this.getCell(period.id, day.code);

    if (existing) {
      this.editingCell = { ...existing };
    } else {
      this.editingCell = new ClassRoutineEntry();
      this.editingCell.periodNo = period.id;
      this.editingCell.dayCode = day.code;
      this.editingCell.dayName = day.name;
      console.log('existing cell from get cell::', this.editingCell);
    }
    this.isCellModalOpen = true;
  }

  closeCellModal() {
    this.isCellModalOpen = false;
    this.editingCell = new ClassRoutineEntry();
  }

  saveCellEdit() {
    const key = `${this.editingPeriodNo}_${this.editingDayCode}`;

    if (!this.editingCell.subjectMasterNo) {
      delete this.routineGrid[key];
      this.closeCellModal();
      return;
    }

    // ── subjectName lookup ─────────────────────────────────
    const selectedSubject = this.subjectList.find(
      (s: any) => s.id === this.editingCell.subjectMasterNo,
    );
    if (selectedSubject) {
      this.editingCell.subjectName = selectedSubject.subjectName;
      this.editingCell.subjectCode = selectedSubject.subjectCode;
    }

    // ── teacherName lookup ────────────────────────────────
    if (this.editingCell.employeeNo) {
      const selectedTeacher = this.teacherList.find(
        (t: any) => t.id === this.editingCell.employeeNo,
      );
      if (selectedTeacher) {
        this.editingCell.teacherName = selectedTeacher.fname;
      }
    } else {
      this.editingCell.teacherName = '';
    }

    // ── roomName lookup ───────────────────────────────────
    if (this.editingCell.roomNo) {
      const selectedRoom = this.roomList.find(
        (r: any) => r.id === this.editingCell.roomNo,
      );
      if (selectedRoom) {
        this.editingCell.roomName = selectedRoom.roomName;
      }
    } else {
      this.editingCell.roomName = '';
    }

    this.routineGrid[key] = { ...this.editingCell };
    this.closeCellModal();
  }

  clearCell(periodNo: number, dayCode: number, event: Event) {
    event.stopPropagation();
    const key = `${periodNo}_${dayCode}`;
    let classRoutineNo = this.getCell(periodNo, dayCode)?.classRoutineNo;
    this.delete(classRoutineNo);
    delete this.routineGrid[key];
  }

  delete(classRoutineNo: any): void {
    console.log('routine no::::', classRoutineNo);
    if (!classRoutineNo) {
      this.toastr.warning('Routine not found.');
    } else {
      const initialState = { title: 'Do you want to Delete?' };
      this.bsModalRef = this.modalService.show(ConfirmationDialog, {
        initialState,
        class: 'modal-md base-modal',
      });
      this.bsModalRef.content.onClose.subscribe((result: any) => {
        if (result) {
          this.routineService
            .delete(classRoutineNo)
            .subscribe((res: { message: string | undefined }) => {
              res.message
                ? this.toastr.success(res.message)
                : this.toastr.warning(res.message);
            });
        }
      });
    }
  }

  // ── Save All ──────────────────────────────────────────
  saveRoutine() {
    if (!this.filter.academicSessionNo || !this.filter.classMasterNo) {
      this.toastr.warning('Please select Session and Class.');
      return;
    }

    const routineData = Object.values(this.routineGrid)
      .filter((cell: any) => cell.subjectMasterNo)
      .map((cell: any) => ({
        dayCode: cell.dayCode,
        periodNo: cell.periodNo,
        subjectMasterNo: cell.subjectMasterNo,
        employeeNo: cell.employeeNo || null,
        roomNo: cell.roomNo || null,
      }));

    if (routineData.length === 0) {
      this.toastr.warning('Please add at least one subject to routine.');
      return;
    }

    this.isSaving = true;
    const payload = {
      academicSessionNo: this.filter.academicSessionNo,
      classMasterNo: this.filter.classMasterNo,
      sectionMasterNo: this.filter.sectionMasterNo,
      shiftMasterNo: this.filter.shiftMasterNo,
      routineList: routineData,
    };

    this.routineService
      .saveRoutine(payload)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (res: any) => {
          if (res.success) {
            this.toastr.success(res.message || 'Routine saved successfully!');
          } else {
            this.toastr.warning(res.message || 'Save failed.');
          }
        },
        error: () => this.toastr.error('Something went wrong.'),
      });
  }

  // ── Print ─────────────────────────────────────────────
  printRoutine() {
    if (!this.filter.academicSessionNo || !this.filter.classMasterNo) {
      this.toastr.warning('Please select Session and Class first.');
      return;
    }
    this.isPrinting = true;
    this.routineService
      .printRoutine(this.filter)
      .pipe(finalize(() => (this.isPrinting = false)))
      .subscribe({
        next: (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 10000);
        },
        error: () => this.toastr.error('Failed to generate routine.'),
      });
  }

  // ── Helper ────────────────────────────────────────────
  isBreakPeriod(period: any): boolean {
    return (
      period.periodType === 'BREAK' ||
      period.periodType === 'PRAYER' ||
      period.periodType === 'ASSEMBLY'
    );
  }

  getSubjectName(subjectMasterNo: number | null): string {
    if (!subjectMasterNo) return '';
    const sub = this.subjectList.find((s: any) => s.id === subjectMasterNo);
    return sub?.subjectName || '';
  }

  getTeacherName(employeeNo: number | null): string {
    if (!employeeNo) return '';
    const t = this.teacherList.find((t: any) => t.id === employeeNo);
    return t?.fname || '';
  }
}
