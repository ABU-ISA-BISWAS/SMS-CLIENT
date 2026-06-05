import { Resource } from '../../../auth/_model/resource.model';

export class SystemConfig extends Resource {
  declare id: number;

  configKey!: string;
  configValue!: string;
  configGroup!: string;
  description!: string;
  isEditable!: number;
  activeStatus: number = 1;
  //transient field
  isGranted!: boolean;
}
