import { Resource } from '../../../auth/_model/resource.model';

export class AcademicClass extends Resource {
  declare id: number;
  activeStatus: number = 1;

  className!: string;

  classCode!: string;

  classOrder!: number;

  //transient field
  isGranted!: boolean;
}
