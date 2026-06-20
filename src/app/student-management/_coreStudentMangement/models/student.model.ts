import { Resource } from '../../../auth/_model/resource.model';

export class StudentMaster extends Resource {
  declare id: number;
  studentNo!: number;
  studentCode!: string;
  fullName!: string;
  fullNameBn!: string;
  dateOfBirth!: string;
  genderNo!: number;
  genderName!: string;
  religionNo!: number;
  religionName!: string;
  bloodGroupNo!: number;
  bloodGroupName!: string;
  nationality: string = 'Bangladeshi';
  birthCertNo!: string;
  nidNo!: string;
  mobileNo: string | null = null;
  email!: string;
  presentAddress!: string;
  permanentAddress!: string;
  photoPath!: string;
  studentCategoryNo!: number;
  categoryName!: string;
  isActive: number = 1;
}
