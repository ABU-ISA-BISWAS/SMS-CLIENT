import { Resource } from '../../../auth/_model/resource.model';

export class StudentCategory extends Resource {
  declare id: number;
  activeStatus: number = 1;
  categoryName!: string;
  description!: string;
  //transient field
  isGranted!: boolean;
}
