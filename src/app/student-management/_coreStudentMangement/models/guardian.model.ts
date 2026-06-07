import { Resource } from "../../../auth/_model/resource.model"; 

export class StudentGuardian extends Resource {
  declare id: number;
  guardianNo!: number;
  studentNo!: number;
  relationNo!: number;
  relationName!: string;
  guardianName!: string;
  guardianNameBn!: string;
  occupation!: string;
  mobileNo!: string;
  email!: string;
  nidNo!: string;
  annualIncome!: number;
  isPrimary: number = 1;
  isActive: number = 1;
}