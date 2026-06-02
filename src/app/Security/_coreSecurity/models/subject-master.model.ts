import { Resource } from '../../../auth/_model/resource.model';

export class SubjectMaster extends Resource {
  declare id: number;
  activeStatus: number = 1;

  subjectName!: string;
  subjectNameBangla!: string;

  subjectCode!: string;

  subjectOrder!: number;

  subjectType!: string;
  subjectCategory!: string;
  fullMarks!: number;
  passMarks!: number;
  creditHour!: number;
  sortOrder!: number;

  //transient field
  isGranted!: boolean;
}
