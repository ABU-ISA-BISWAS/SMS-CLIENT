import { Resource } from '../../../auth/_model/resource.model';

export class SubjectMaster extends Resource {
  declare id: number;
  activeStatus: number = 1;
  subjectName!: string;
  subjectNameBn!: string;
  subjectCode!: string;
  subjectType!: string;
  subjectCategory!: string;
  fullMarks!: number;
  passMarks!: number;
  creditHour!: number;
  sortOrder!: number;
  //transient field
  isGranted!: boolean;
}
