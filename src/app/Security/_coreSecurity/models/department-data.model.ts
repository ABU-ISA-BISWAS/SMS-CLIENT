import { DepartmentFlagModel } from './department-flag.model';
import { Department } from './department.model'; 

export class DepartmentData {

    department: Department = new Department;
    departmentFlag: DepartmentFlagModel = new DepartmentFlagModel;

    setDepartment(_department: Department){
        this.department = _department;
    }
    setDepartmentFlag(_departmentFlag: DepartmentFlagModel){
        this.departmentFlag = _departmentFlag;
    }
}
