import { Resource } from "../../../core/models/resource.model"; 

export class OpdLookupDetail extends Resource {

    lookupdtlNoParent!: number;
    lookupNo: number = 0;
    dtlName!: string;
    dtlDescription!: string;
    activeStatus!: number;
    slNo!: number;
    buNo : number | null = null;
    


}
