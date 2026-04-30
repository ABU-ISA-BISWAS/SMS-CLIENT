import { Resource } from '../../../auth/_model/resource.model';

export class AcademicSection extends Resource {
  declare id: number;
  activeStatus: number = 1;

  sectionName!: string;

  sectionCode!: string;

  //transient field
  isGranted!: boolean;
}
