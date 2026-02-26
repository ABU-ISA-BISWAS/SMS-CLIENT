import { Department } from '../models/department.model';



export class DepartmentSerializers {
    fromJson(json: any): Department {
        const department = new Department();


        department.id = json.id;
        department.buName = json.buName;
        department.reportHeader = json.reportHeader;
        department.activeStatus = json.activeStatus;
       
        department.accCcNo = json.accCcNo;
        department.accSaNo = json.accSaNo;
        department.divisionNO = json.divisionNO;
        department.buHead = json.buHead;
        department.buNoParent = json.buNoParent;
        department.clinicalDeptFlag = json.clinicalDeptFlag;
        department.buId = json.buId;
        return department;

    }

    toJson(department: Department): any{
    return{

        id: department.id,
        buName: department.buName,
        reportHeader: department.reportHeader,
        activeStatus: department.activeStatus,
      
        accCcNo: department.accCcNo,
        accSaNo: department.accSaNo,
        divisionNO: department.divisionNO,
        buHead: department.buHead,
        buNoParent: department.buNoParent,
        clinicalDeptFlag: department.clinicalDeptFlag,
        buId: department.buId
    }
        
    }
}