export class ClassRoutineEntry {
  classRoutineNo: number | null = null;
  dayCode: number | null = null;
  dayName: string = '';
  periodNo: number | null = null;
  subjectMasterNo: number | null = null;
  subjectName: string = '';
  employeeNo: number | null = null;
  teacherName: string = '';
  roomNo: number | null = null;
  roomName: string = '';
}

export class ClassRoutineFilter {
  academicSessionNo: number | null = null;
  classMasterNo: number | null = null;
  sectionMasterNo: number | null = null;
  shiftMasterNo: number | null = null;
}
