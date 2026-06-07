import { HrBusinessUnit } from '../../../Security/_coreSecurity/models/hr-bu.model';

export class HrBuSerializer {
  fromJson(json: any): HrBusinessUnit {
    const buList = new HrBusinessUnit();

    return buList;
  }

  toJson(patientType: HrBusinessUnit): any {
    return {};
  }
}
