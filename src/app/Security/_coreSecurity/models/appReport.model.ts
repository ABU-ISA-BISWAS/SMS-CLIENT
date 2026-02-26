import { Resource } from "../../../auth/_model/resource.model";  

export class AppreportModel extends Resource {
    
    declare id: number;
    rptId!: string;
    rptName!: string;
    rptModule!: string;
    rptGroupId!: string;
    rptGroupName!: string;
    rptTitle!: string;
    rptSubTitle!: string;
    rptHeader!: string;
    rptFooter!: string;
    rptHeaderImage!: string;
    rptFooterImage!: string;
    rptDescription!: string;
    rptCompanyName!: string;
    rptAddress1!: string;
    rptAddress2!: string;
    rptJsprName!: string;
    rptJsprSubName!: string; 
    activeStatus: number = 1;
    companyAlias!: string;
    remarks!: string;

}