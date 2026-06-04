import { Resource } from '../../../core/models/resource.model';

export class FeeStructure extends Resource {
  declare id: number;
  academicSessionNo!: number;
  sessionName!: string;
  classMasterNo!: number;
  className!: string;
  studentCategoryNo!: number;
  categoryName!: string;
  feeHeadNo!: number;
  feeHeadName!: string;
  feeCategory!: string;
  amount!: number;
  dueDay!: number;
  fineAmount: number = 0;
  effectiveFrom!: string;
  effectiveTo!: string;
  activeStatus: number = 1;
}
