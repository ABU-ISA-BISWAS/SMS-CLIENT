import { Resource } from '../../../core/models/resource.model';

export class SalaryGrade extends Resource {
  declare id: number;
  gradeCode!: string;
  gradeName!: string;
  basicSalary!: number;
  houseRentPct: number = 45;
  medicalAllowance: number = 1500;
  transportAllowance: number = 500;
  conveyance: number = 0;
  otherAllowance: number = 0;
  effectiveFrom!: string;
  effectiveTo!: string;
  activeStatus: number = 1;
  companyNo!: number;

  // computed (not stored)
  get totalGross(): number {
    return (
      (this.basicSalary || 0) +
      ((this.basicSalary || 0) * (this.houseRentPct || 0)) / 100 +
      (this.medicalAllowance || 0) +
      (this.transportAllowance || 0) +
      (this.conveyance || 0) +
      (this.otherAllowance || 0)
    );
  }
}
