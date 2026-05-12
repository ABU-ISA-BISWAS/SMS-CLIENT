import { Resource } from '../../../auth/_model/resource.model';

export class GuardianRelation extends Resource {
  declare id: number;
  activeStatus: number = 1;
  name!: string;
  //transient field
  isGranted!: boolean;
}
