export class UserGrantRole {

    [key: string]: any;
    id!: number;
    userNo!: number;
    canGrant!: number;
    grantor!: number;
    grantDt!: Date;
    activeStatus!: number;
    ssUploadedOn!: Date;
    roleNo!: number;
    isChange!: boolean;
    
    showFeatures?: boolean;
    features?: any[];
    loadingFeatures?: boolean;
    roleName!: string;
    changedFeatures?: any[];


}
