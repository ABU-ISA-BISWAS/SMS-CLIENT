import { Resource } from "../../../auth/_model/resource.model"; 


export class DepartmentFlagModel extends Resource {

    wsDepartment!: number;
    web!: string;
    treeLevel!: number;
    storeAutoConFlag: number = 0;
    rootBuNo!: number;
    repVerifyPrompt!: string;
    repPreparedPrompt!: string;
    repConsultantPrompt!: string;
    reportSlNo!: number;
    reportName!: string;
    reportHeader!: string;
    refCompanyNo!: number;
    referralDepartment!: number;
    printReqSlip!: number;
    operationBy!: number;
    opdConsultationFlag: number = 0;
    lookupDetailNo!: number;
    loc!: string;
    itDepartmentFlag: number = 0;
    isLeaf!: number;
    ipdDepartment!: number;
    filmRequired!: number;
    fax!: string;
    email!: string;
    description!: string;
    deptPrifix!: string;
    defDiscPct!: number;
    dcDocSharePct!: number;
    dcDocShareFlag: number = 0;
    dayCareFlag: number = 0;
    contractBy!: number;
    companyNo!: number;
    clinicalDeptFlag: number = 0;
    buTypeNo!: number;
    buPhone!: string;
    buOpeningDate!: Date;
    buNoTree!: string;
    buNo!: number;
    buNameTree!: string;
    buNameLevel!: string;
    buLocationType!: string;
    buGrade!: string;
    buCategoryFlag!: string;
    buCategory!: string;
    buAlias!: string;
    buAddress2!: string;
    buAddress!: string;
    baNo!: number;
    barcodeDgt!: number;
    accAutoConFlag: number = 0;
    billingFlag: number = 0;
    deptBIllActivationFlag: number = 0;
    reporType!: number;
    onlineFlag!: number;
    // businessDays = {
    //     activeDays: {
    //         saturday: true,
    //         sunday: true,
    //         monday: true,
    //         tuesday: true,
    //         wednesday: true,
    //         thursday: true,
    //         friday: false
    //     }
    // };

    businessDays = {
        activeDays: {

            saturday: {
                id: 6,
                value: true
            },
            sunday: {
                id: 7,
                value: true
            },
            monday: {
                id: 1,
                value: true
            },
            tuesday: {
                id: 2,
                value: true
            },
            wednesday: {
                id: 3,
                value: true
            },
            thursday: {
                id: 4,
                value: true
            },
            friday: {
                id: 5,
                value: false
            }
        }
    };

}