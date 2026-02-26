import { Resource } from "../../../auth/_model/resource.model"; 

export class BankInfoModel extends Resource {

    
    declare id: number;
    bankName!: string;
    bankAccountName!: string;
    bankAccountNo!: string;
    bankBranch!: string;
    bankAccountType!: string;
    bankAccountSwiftcode!: string;
    activeStatus: number=1;
    ssUploadedOn!: Date;
    routingOn!: string;

}