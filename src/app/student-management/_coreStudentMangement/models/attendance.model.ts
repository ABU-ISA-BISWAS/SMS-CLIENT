export class AttendanceEntry {
  studentNo!: number;
  admissionNo!: number;
  studentCode!: string;
  fullName!: string;
  fullNameBn!: string;
  rollNo!: string;
  status: string = 'P'; // default Present
  remarks: string = '';
}

export class AttendanceSaveRequest {
  attendanceDate!: string;
  academicSessionNo!: number;
  classMasterNo!: number;
  sectionMasterNo!: number | null;
  shiftMasterNo!: number | null;
  attendanceList!: AttendanceEntry[];
}

export class AttendanceReportDto {
  studentNo!: number;
  studentCode!: string;
  fullName!: string;
  rollNo!: string;
  totalDays!: number;
  presentDays!: number;
  absentDays!: number;
  lateDays!: number;
  excusedDays!: number;
  attendancePct!: number;
}
