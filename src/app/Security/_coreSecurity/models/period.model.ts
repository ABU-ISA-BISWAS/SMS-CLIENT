import { Resource } from '../../../core/models/resource.model';

export class Period extends Resource {
  declare id: number;
  shiftNo!: number;
  periodName!: string;
  periodOrder!: number;
  periodType!: string;
  duratonMinutes!: number;
  startTime!: string;
  endTime!: string;
  activeStatus: number = 1;
  companyNo!: number;
}
