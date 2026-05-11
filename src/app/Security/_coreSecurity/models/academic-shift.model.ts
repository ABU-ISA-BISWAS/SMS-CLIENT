import { Resource } from '../../../auth/_model/resource.model';

export class AcademicShift extends Resource {
  declare id: number;
  activeStatus: number = 1;

  shiftName!: string;

  startTime!: string;

  endTime!: string;

  //transient field
  isGranted!: boolean;
}
