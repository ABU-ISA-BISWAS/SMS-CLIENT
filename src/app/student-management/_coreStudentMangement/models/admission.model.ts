import { Resource } from '../../../core/models/resource.model'; 
import { StudentMaster } from './student.model';
import { StudentGuardian } from './guardian.model';

export class StudentAdmission extends Resource {
  declare id: number;
  admissionNo!: number;
  admissionRegNo!: string;
  studentNo!: number;
  academicSessionNo!: number;
  sessionName!: string;
  classMasterNo!: number;
  className!: string;
  sectionMasterNo!: number;
  sectionName!: string;
  shiftMasterNo!: number;
  shiftName!: string;
  groupVersionNo!: number;
  groupName!: string;
  rollNo!: string;
  admissionDate!: string;
  admissionType: string = 'NEW';
  admissionStatus: string = 'ACTIVE';
  tcDate!: string;
  tcReason!: string;
  prevSchool!: string;
  prevClass!: string;
  prevRoll!: string;
  remarks!: string;
  isActive: number = 1;

  // Nested for save
  student: StudentMaster = new StudentMaster();
  guardian: StudentGuardian = new StudentGuardian();
}

export class AdmissionStatusUpdate {
  admissionNo!: number;
  admissionStatus!: string;
  tcDate!: string;
  tcReason!: string;
}