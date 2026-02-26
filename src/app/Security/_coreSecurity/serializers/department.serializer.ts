import { Department } from '../models/department.model';

export class DepartmentSerializers {
  fromJson(json: any): Department {
    const department = new Department();

    department.id = json.id;
    department.buName = json.buName;
    department.activeStatus = json.activeStatus;
    department.buId = json.buId;
    return department;
  }

  toJson(department: Department): any {
    return {
      id: department.id,
      buName: department.buName,
      activeStatus: department.activeStatus,
      buId: department.buId,
    };
  }
}
