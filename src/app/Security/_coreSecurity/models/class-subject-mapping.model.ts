import { Resource } from '../../../core/models/resource.model';

export class ClassSubjectMapping extends Resource {
  declare id: number;
  classMasterNo!: number;
  className!: string;
  groupVersionNo!: number;
  groupVersionName!: string;
  subjectMasterNo!: number;
  subjectName!: string;
  subjectCode!: string;
  isOptional: number = 0;
  sortOrder!: number;
  activeStatus: number = 1;
  companyNo!: number;
}
