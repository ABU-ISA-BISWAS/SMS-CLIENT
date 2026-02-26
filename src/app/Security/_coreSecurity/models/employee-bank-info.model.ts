import { Resource } from "../../../auth/_model/resource.model"; 

export class EmployeeBankInfoModel extends Resource {

    
    declare id: number;
    bankNo!: number | null;
    empNo!: number;
    bankAccountNo!: string;
    bankBranch!: string;
    bankAccountSwiftcode!: string;
    activeStatus: number=1;
    defaultFlag: number=1;
    routingNo!: string;

}