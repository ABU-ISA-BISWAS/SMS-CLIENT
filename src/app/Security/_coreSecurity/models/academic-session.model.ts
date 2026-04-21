import { Resource } from '../../../auth/_model/resource.model';

export class AcademicSession extends Resource {
  declare id: number;
  activeStatus: number = 1;

  sessionName!: string;

  startDate!: Date;

  endDate!: Date;

  remarks!: string;

  //transient field
  isGranted!: boolean;
}
