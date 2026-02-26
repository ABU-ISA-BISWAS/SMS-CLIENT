import { DepartmentFlagModel } from '../models/department-flag.model';


export class DepartmentFlagSerializer{

    fromJson(json: any):  DepartmentFlagModel{
        const departmentFlat = new DepartmentFlagModel();


        departmentFlat.wsDepartment = json.wsDepartment;
        departmentFlat.web = json.web;
        departmentFlat.treeLevel = json.treeLevel;
        departmentFlat.rootBuNo = json.rootBuNo;
        departmentFlat.repVerifyPrompt = json.repVerifyPrompt;
        departmentFlat.repPreparedPrompt = json.repPreparedPrompt;
        departmentFlat.repConsultantPrompt = json.repConsultantPrompt;
        departmentFlat.reportSlNo = json.reportSlNo;
        departmentFlat.reportName = json.reportName;
        departmentFlat.reportHeader = json.reportHeader;
        departmentFlat.refCompanyNo = json.refCompanyNo;
        departmentFlat.referralDepartment = json.referralDepartment;
        departmentFlat.printReqSlip = json.printReqSlip;
        departmentFlat.operationBy = json.operationBy;
        departmentFlat.opdConsultationFlag = json.opdConsultationFlag;
        departmentFlat.lookupDetailNo = json.lookupDetailNo;
        departmentFlat.loc = json.loc;
        departmentFlat.itDepartmentFlag = json.itDepartmentFlag;
        departmentFlat.isLeaf = json.isLeaf;
        departmentFlat.ipdDepartment = json.ipdDepartment;
        departmentFlat.filmRequired = json.flimRequired;
        departmentFlat.fax = json.fax;
        departmentFlat.email = json.email;
        departmentFlat.description = json.description;
        departmentFlat.deptPrifix = json.deptPrifix;
        departmentFlat.defDiscPct = json.defDiscPct;
        departmentFlat.dcDocSharePct = json.dcDocSharePct;
        departmentFlat.dcDocShareFlag = json.dcDocShareFlag;
        departmentFlat.dayCareFlag = json.dayCareFlag;
        departmentFlat.contractBy = json.contractBy;
        departmentFlat.companyNo = json.companyNo;
        departmentFlat.clinicalDeptFlag = json.clinicalDeptFlag;
        departmentFlat.buTypeNo = json.buTypeNo;
        departmentFlat.buPhone = json.buPhone;
        departmentFlat.buOpeningDate = json.buOpeningDate;
        departmentFlat.buNoTree = json.buNoTree;
        departmentFlat.buNo = json.buNo;
        departmentFlat.buNameTree = json.buNameTree;
        departmentFlat.buNameLevel = json.buNameLevel;
        departmentFlat.buLocationType = json.buLocationType;
        departmentFlat.buGrade = json.buGrade;
        departmentFlat.buCategoryFlag = json.buCategoryFlag;
        departmentFlat.buCategory = json.buCategory;
        departmentFlat.buAlias = json.buAlias;
        departmentFlat.buAddress2 = json.buAddress2;
        departmentFlat.buAddress = json.buAddress;
        departmentFlat.baNo = json.baNo;
        departmentFlat.barcodeDgt = json.barcodeDgt;
        departmentFlat.accAutoConFlag = json.accAutoConFlag;

        return departmentFlat;

    }

    toJson(departmentFlat: DepartmentFlagModel): any{

        return{

            wsDepartment:  departmentFlat.wsDepartment,
            web:  departmentFlat.web,
            treeLevel:  departmentFlat.treeLevel,
            rootBuNo:  departmentFlat.rootBuNo,
            repVerifyPrompt:  departmentFlat.repVerifyPrompt,
            repPreparedPrompt:  departmentFlat.repPreparedPrompt,
            repConsultantPrompt:  departmentFlat.repConsultantPrompt,
            reportSlNo:  departmentFlat.reportSlNo,
            reportName:  departmentFlat.reportName,
            reportHeader:  departmentFlat.reportHeader,
            refCompanyNo:  departmentFlat.refCompanyNo,
            referralDepartment:  departmentFlat.referralDepartment,
            printReqSlip:  departmentFlat.printReqSlip,
            operationBy:  departmentFlat.operationBy,
            opdConsultationFlag:  departmentFlat.opdConsultationFlag,
            lookupDetailNo:  departmentFlat.lookupDetailNo,
            loc:  departmentFlat.loc,
            itDepartmentFlag:  departmentFlat.itDepartmentFlag,
            isLeaf:  departmentFlat.isLeaf,
            ipdDepartment:  departmentFlat.ipdDepartment,
            flimRequired:  departmentFlat.filmRequired,
            fax:  departmentFlat.fax,
            email:  departmentFlat.email,
            description:  departmentFlat.description,
            deptPrifix:  departmentFlat.deptPrifix,
            defDiscPct:  departmentFlat.defDiscPct,
            dcDocSharePct:  departmentFlat.dcDocSharePct,
            dcDocShareFlag:  departmentFlat.dcDocShareFlag,
            dayCareFlag:  departmentFlat.dayCareFlag,
            contractBy:  departmentFlat.contractBy,
            companyNo:  departmentFlat.companyNo,
            clinicalDeptFlag:  departmentFlat.clinicalDeptFlag,
            buTypeNo:  departmentFlat.buTypeNo,
            buPhone:  departmentFlat.buPhone,
            buOpeningDate:  departmentFlat.buOpeningDate,
            buNoTree:  departmentFlat.buNoTree,
            buNo:  departmentFlat.buNo,
            buNameTree:  departmentFlat.buNameTree,
            buNameLevel:  departmentFlat.buNameLevel,
            buLocationType:  departmentFlat.buLocationType,
            buGrade:  departmentFlat.buGrade,
            buCategoryFlag:  departmentFlat.buCategoryFlag,
            buCategory:  departmentFlat.buCategory,
            buAlias:  departmentFlat.buAlias,
            buAddress2:  departmentFlat.buAddress2,
            buAddress:  departmentFlat.buAddress,
            baNo:  departmentFlat.baNo,
            barcodeDgt:  departmentFlat.barcodeDgt,
            accAutoConFlag:  departmentFlat.accAutoConFlag,
        }

    }


}