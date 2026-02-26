import { Resource } from '../../../core/models/resource.model';

export class CompanyModel extends Resource {
  declare id: number;
  companyName!: string;
  companyAlias!: string;
  companySlogan!: string;
  companyAddress1!: string;
  companyAddress2!: string;
  companyVillage!: string;
  companyUnion!: string;
  companyThana!: string;
  companyDistrict!: string;
  companyDivision!: string;
  companyCountry!: string;
  companyPhone!: string;
  companyMobile!: string;
  companyFax!: string;
  companyEmail!: string;
  companyWebsite!: string;
  lcnVal!: string;
  expiredOn!: Date;
  activeStatus!: number;
  ssCreator!: number;
  ssCreatedOn!: Date;
  ssCreatedSession!: number;
  ssModifier!: number;
  ssModifiedOn!: Date;
  ssModifiedSession!: number;
  logonUrl!: string;
  lcnExpMsgDay!: number;
  ogNo!: number;
  ogName!: string;
  mailSmtpHost!: string;
  mailSmtpPort!: number;
  mailAuthUserName!: string;
  mailAuthEmailPassword!: string;
}
