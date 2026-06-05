import { Resource } from '../../../core/models/resource.model';

export class Holiday extends Resource {
  declare id: number;
  holidayName!: string;
  holidayNameBn!: string;
  fromDate!: string;
  toDate!: string;
  holidayType!: string;
  academicSessionNo!: number;
  sessionName!: string;
  isRecurring: number = 0;
  activeStatus: number = 1;
  companyNo!: number;
}
