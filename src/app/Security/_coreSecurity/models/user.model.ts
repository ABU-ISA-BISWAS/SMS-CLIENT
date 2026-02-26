import { Resource } from "../../../auth/_model/resource.model"; 

export class UserModel extends Resource {

    declare id: number;
    userId!: string;
    userName!: string;
    password!: string;
    activeStatus: number=1;
    rem!: string;
    empNo!: number | null;
    defaultModuleId!: number;
    enabled: boolean = true;
    accountLocked!: boolean;
    accountExpired!: boolean;
    passwordExpired!: boolean;
    accountExpireDate!: Date;
    defaultPageLink!: string;
    personalNumber!: string;
    unitNo!: number;
    unitUserFlag!: number;
    pwdChangeRequired!: number;
}