import { Resource } from '../../../auth/_model/resource.model';

export class SubjectMaster extends Resource {
  declare id: number;
  activeStatus: number = 1;

  subjectName!: string;

  subjectCode!: string;

  subjectOrder!: number;

  //transient field
  isGranted!: boolean;
}
