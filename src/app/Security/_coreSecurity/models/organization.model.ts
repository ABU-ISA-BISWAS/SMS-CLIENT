import { Resource } from '../../../core/models/resource.model';

export class OrganizationModel extends Resource {
  declare id: number;
  ogName!: string;
  ogAlias!: string;
  ogSlogan!: string;
  ogAddress!: string;
  ogVillage!: string;
  ogUnion!: string;
  ogThana!: string;
  ogDistrict!: string;
  ogDivision!: string;
  ogCountry!: string;
  ogPhone!: string;
  ogMobile!: string;
  ogFax!: string;
  ogEmail!: string;
  ogWebsite!: string;
  ogLogo!: string;
  multiCompanyFlag!: string;
  lcnVal!: string;
  expiredOn!: Date;
  activeStatus!: number;
  ssCreator!: number;
  ssCreatedOn!: Date;
  ssCreatedSessi!: number;
  ssModifier!: number;
  ssModifiedOn!: Date;
  ssModifiedSessi!: number;
  lcnExpMsgD!: number;
}
