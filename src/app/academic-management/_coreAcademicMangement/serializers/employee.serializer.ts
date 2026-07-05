import { EmployeeModel } from '../../../Security/_coreSecurity/models/employee.model';

export class EmployeeSerializer {
  fromJson(json: any): EmployeeModel {
    const personnel = new EmployeeModel();

    personnel.id = json.id;
    personnel.empId = json.empId;
    personnel.fname = json.fname;
    personnel.activeStatus = json.activeStatus;
    personnel.buNo = json.buNo;
    personnel.joinDate = json.joinDate;
    personnel.jobtitleNo = json.jobtitleNo;
    personnel.gender = json.gender;
    personnel.ssUploadedOn = json.ssUploadedOn;
    personnel.empName = json.empName;
    personnel.empSignature = json.empSignature;
    personnel.doctorNo = json.doctorNo;
    personnel.punchCardNo = json.punchCardNo;
    personnel.identificationSign = json.identificationSign;
    personnel.confirmationDate = json.confirmationDate;
    personnel.birthRegNo = json.birthRegNo;
    personnel.referenceFrom = json.referenceFrom;
    personnel.empImagePath = json.empImagePath;
    personnel.salutation = json.salutation;
    personnel.lname = json.lname;
    personnel.fatherName = json.fatherName;
    personnel.motherName = json.motherName;
    personnel.spouseName = json.spouseName;
    personnel.maritalStatus = json.maritalStatus;
    personnel.dob = json.dob;
    personnel.empType = json.empType;
    personnel.jobType = json.jobType;
    personnel.bloodGrp = json.bloodGrp;
    personnel.religion = json.religion;
    personnel.phoneHome = json.phoneHome;
    personnel.phoneMobile = json.phoneMobile;
    personnel.phoneOffice = json.phoneOffice;
    personnel.nationality = json.nationality;
    personnel.peAddr1 = json.peAddr1;
    personnel.peAddr2 = json.peAddr2;
    personnel.peAddr3 = json.peAddr3;
    personnel.peAddrPost = json.peAddrPost;
    personnel.peAddrDist = json.peAddrDist;
    personnel.peAddrCountry = json.peAddrCountry;
    personnel.prCareOfAddr = json.prCareOfAddr;
    personnel.prAddr1 = json.prAddr1;
    personnel.prAddr2 = json.prAddr2;
    personnel.prAddr3 = json.prAddr3;
    personnel.prAddrDist = json.prAddrDist;
    personnel.prAddrPost = json.prAddrPost;
    personnel.prAddrCountry = json.prAddrCountry;
    personnel.remarks = json.remarks;
    personnel.userName = json.userName;
    personnel.pwd = json.pwd;
    personnel.emailPersonal = json.emailPersonal;
    personnel.emailOfficial = json.emailOfficial;
    personnel.passportNo = json.passportNo;
    personnel.reportingTo = json.reportingTo;
    personnel.drivinglcNo = json.drivinglcNo;
    personnel.tinNo = json.tinNo;
    personnel.faxNo = json.faxNo;
    personnel.jobtitleDate = json.jobtitleDate;
    personnel.peCareOfAddr = json.peCareOfAddr;
    personnel.pabxExt = json.pabxExt;
    personnel.salaryBankNo = json.salaryBankNo;
    personnel.salaryBankAccNo = json.salaryBankAccNo;
    personnel.placeOfBirth = json.placeOfBirth;
    personnel.cardNo = json.cardNo;
    personnel.contractDate = json.contractDate;
    personnel.contractExpireDate = json.contractExpireDate;
    personnel.contractPersonName = json.contractPersonName;
    personnel.contractRelation = json.contractRelation;
    personnel.contractPhone = json.contractPhone;
    personnel.contractMobile = json.contractMobile;
    personnel.contractEmail = json.contractEmail;

    return personnel;
  }

  toJson(personnel: EmployeeModel): any {
    return {
      id: personnel.id,
      empId: personnel.empId,
      fname: personnel.fname,
      activeStatus: personnel.activeStatus,
      buNo: personnel.buNo,
      joinDate: personnel.joinDate,
      jobtitleNo: personnel.jobtitleNo,
      gender: personnel.gender,
      ssUploadedOn: personnel.ssUploadedOn,
      empName: personnel.empName,
      empSignature: personnel.empSignature,
      doctorNo: personnel.doctorNo,
      punchCardNo: personnel.punchCardNo,
      identificationSign: personnel.identificationSign,
      confirmationDate: personnel.confirmationDate,
      birthRegNo: personnel.birthRegNo,
      referenceFrom: personnel.referenceFrom,
      empImagePath: personnel.empImagePath,
      salutation: personnel.salutation,
      lname: personnel.lname,
      fatherName: personnel.fatherName,
      motherName: personnel.motherName,
      spouseName: personnel.spouseName,
      maritalStatus: personnel.maritalStatus,
      dob: personnel.dob,
      empType: personnel.empType,
      jobType: personnel.jobType,
      bloodGrp: personnel.bloodGrp,
      religion: personnel.religion,
      phoneHome: personnel.phoneHome,
      phoneMobile: personnel.phoneMobile,
      phoneOffice: personnel.phoneOffice,
      nationality: personnel.nationality,
      peAddr1: personnel.peAddr1,
      peAddr2: personnel.peAddr2,
      peAddr3: personnel.peAddr3,
      peAddrPost: personnel.peAddrPost,
      peAddrDist: personnel.peAddrDist,
      peAddrCountry: personnel.peAddrCountry,
      prCareOfAddr: personnel.prCareOfAddr,
      prAddr1: personnel.prAddr1,
      prAddr2: personnel.prAddr2,
      prAddr3: personnel.prAddr3,
      prAddrDist: personnel.prAddrDist,
      prAddrPost: personnel.prAddrPost,
      prAddrCountry: personnel.prAddrCountry,
      remarks: personnel.remarks,
      userName: personnel.userName,
      pwd: personnel.pwd,
      emailPersonal: personnel.emailPersonal,
      emailOfficial: personnel.emailOfficial,
      passportNo: personnel.passportNo,
      reportingTo: personnel.reportingTo,
      drivinglcNo: personnel.drivinglcNo,
      tinNo: personnel.tinNo,
      faxNo: personnel.faxNo,
      jobtitleDate: personnel.jobtitleDate,
      peCareOfAddr: personnel.peCareOfAddr,
      pabxExt: personnel.pabxExt,
      salaryBankNo: personnel.salaryBankNo,
      salaryBankAccNo: personnel.salaryBankAccNo,
      placeOfBirth: personnel.placeOfBirth,
      cardNo: personnel.cardNo,
      contractDate: personnel.contractDate,
      contractExpireDate: personnel.contractExpireDate,
      contractPersonName: personnel.contractPersonName,
      contractRelation: personnel.contractRelation,
      contractPhone: personnel.contractPhone,
      contractMobile: personnel.contractMobile,
      contractEmail: personnel.contractEmail,
    };
  }

  toArray(json: any): EmployeeModel[] {
    let newPersonnelList: EmployeeModel[] = [];
    json.forEach((element: any) => {
      newPersonnelList.push(this.fromJson(element));
    });

    return newPersonnelList;
  }
}
