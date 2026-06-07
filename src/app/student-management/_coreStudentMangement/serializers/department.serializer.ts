import { Department } from '../models/department.model';

export class DepartmentSerializers {
  fromJson(json: any): Department {
    const department = new Department();
    department.id = json.id;
    department.deptName = json.deptName;
    department.deptNameBn = json.deptNameBn;
    department.deptCode = json.deptCode;
    department.deptType = json.deptType;
    department.sortOrder = json.sortOrder;
    department.activeStatus = json.activeStatus;
    return department;
  }

  toJson(department: Department): any {
    return {
      id: department.id,
      deptName: department.deptName,
      deptNameBn: department.deptNameBn,
      deptCode: department.deptCode,
      deptType: department.deptType,
      sortOrder: department.sortOrder,
      activeStatus: department.activeStatus,
    };
  }
}
