import { UserCompany } from '../../../Security/_coreSecurity/models/user-company.model';
export class UserCompanySerializer {
  fromJson(json: any): UserCompany {
    const userCompany = new UserCompany();

    userCompany.companyId = json.companyId;
    userCompany.compnayName = json.compnayName;
    userCompany.compnayAddress1 = json.compnayAddress1;
    userCompany.compnayAddress2 = json.compnayAddress2;
    userCompany.compnayEmail = json.compnayEmail;
    userCompany.orgId = json.companyId;

    return userCompany;
  }
  toJson(userCompany: UserCompany): any {
    return {
      companyId: userCompany.companyId,
      compnayName: userCompany.compnayName,
      compnayAddress1: userCompany.compnayAddress1,
      compnayAddress2: userCompany.compnayAddress2,
      compnayEmail: userCompany.compnayEmail,
      orgId: userCompany.orgId,
    };
  }
}
