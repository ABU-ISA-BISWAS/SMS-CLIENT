import { Resource } from '../../../auth/_model/resource.model';

export class Department extends Resource {
  buName!: string;
  activeStatus: number = 1;
  buId!: string;
}
