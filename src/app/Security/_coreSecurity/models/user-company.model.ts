import { Resource } from "../../../auth/_model/resource.model"; 

export class UserCompany extends Resource {
    companyId!: number;
    compnayName!: string;
    compnayAddress1!: string;
    compnayAddress2!: string;
    compnayEmail!: string;
    orgId!: number;
}
