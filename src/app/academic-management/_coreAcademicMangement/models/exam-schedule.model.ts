export class ExamScheduleModel {
  examScheduleNo: number | null = null;
  examScheduleName: string = '';
  examTypeNo: number | null = null;
  academicSessionNo: number | null = null;
  classMasterNo: number | null = null;
  examStartDate: string = '';
  examEndDate: string = '';
  resultPublishDate: string = '';
  totalMarks: number = 100;
  passMarks: number = 33;
  remarks!: string;
  status: string = 'DRAFT';
}

export class ExamRoutineModel {
  examRoutineNo: number | null = null;
  examScheduleNo: number | null = null;
  subjectMasterNo: number | null = null;
  subjectName: string = '';
  subjectCode: string = '';
  examDate: string = '';
  startTime: string = '09:00';
  endTime: string = '12:00';
  durationMinutes: number = 180;
  roomNo: number | null = null;
  fullMarks: number = 100;
  passMarks: number = 33;
  mcqMarks: number | null = null;
  writtenMarks: number | null = null;
  practicalMarks: number | null = null;
  remarks: string = '';
}
