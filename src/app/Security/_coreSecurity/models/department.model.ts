import { Resource } from '../../../auth/_model/resource.model';

export class Department extends Resource {
  deptName!: string;
  deptNameBn!: string;
  deptCode!: string;
  deptType!: string;
  sortOrder!: number;
  activeStatus: number = 1;
}
