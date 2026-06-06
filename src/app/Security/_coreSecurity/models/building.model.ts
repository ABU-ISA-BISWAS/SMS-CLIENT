import { Resource } from '../../../core/models/resource.model';

export class Building extends Resource {
  declare id: number;
  buildingCode!: string;
  buildingName!: string;
  buildingNameBn!: string;
  totalFloor!: number;
  activeStatus: number = 1;
  companyNo!: number;
}
