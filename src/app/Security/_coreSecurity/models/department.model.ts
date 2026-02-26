import { Resource } from "../../../auth/_model/resource.model"; 


export class Department extends Resource{


    
    buName!: string;
    reportHeader!: string;
    activeStatus: number = 1;
    accCcNo!: number;
    accSaNo!: number;
    divisionNO!: number;
    buHead!: number;
    buNoParent!: number | null;
    clinicalDeptFlag!: number;
    buId!: string;
}