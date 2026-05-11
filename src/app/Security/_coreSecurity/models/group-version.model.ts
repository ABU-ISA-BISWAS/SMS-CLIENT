import { Resource } from '../../../auth/_model/resource.model';

export class GroupVersion extends Resource {
  declare id: number;
  activeStatus: number = 1;

  name!: string;

  type!: string;

  //transient field
  isGranted!: boolean;
}
