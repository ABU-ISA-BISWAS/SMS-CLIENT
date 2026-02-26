import { Resource } from "../../../auth/_model/resource.model"; 

export class DoctorModel extends Resource {

    doctorNo!: number;
    doctorId!: string;
    salutation!: string;
    firstName!: string;
    lName!: string;
    fatherName!: string;
    motherName!: string;
    spouseName!: string;
    gender!: string;
    maritalStatus!: string;
    dob!: Date;
    buNo!: number;
    joinDate!: Date;
    jobTitleNo!: number;
    activeStatus: number=1;
    bloodGroup!: string;
    religion!: number;
    phoneHome!: string;
    phoneMobile!: string;
    phoneOffice!: string;
    nationality!: string;
    peAddress1!: string;
    peAddress2!: string;
    peAddress3!: string;
    peAddressPost!: string;
    peAddressDist!: number;
    peAddressCountry!: number;
    prCareOfAddress!: string;
    prAddress1!: string;
    prAddress2!: string;
    prAddress3!: string;
    prAddressDist!: number;
    prAddressPost!: string;
    prAddressCountry!: number;
    preferedAddress!: string;
    referalFlag: number = 0;
    reportingFlag: number  = 0;
    wsFlag: number =0;
    repType!: number;
    intExtFlag!: number; // 0 = internal, 1 = External
    corporateHouseFlag: number = 0 ;
    EmerEntryFlag!: number;
    discOverflowFlag!: number;
    opdConsultationFlag!: number;
    opdAppointmentPol!: number;
    opdConfeecollPol!: number;
    opdConsultationFee!: number;
    avgDurationMin!: number;
    avgLoadPerDay!: number;
    blockLoad!: number;
    ipdConsultationFlag!: number;
    emrConsultationFlag!: number;
    primaryDoctorFlag: number = 0 ;
    dutyDoctorFlag: number = 0;
    anaestesiologisFlag!: number;
    nurseFlag!: number;
    sampleCollFlag!: number;
    surgeonFlag: number =0 ;
    specializationNo!: number;
    roomNo!: number;
    ipdConsultationFee!: number;
    emrConsultationFee!: number;
    daycareConsultationFee!: number;
    opdConsultationFeeOld!: number;
    opdConsultationFeeFl!: number;
    opdConsultationFeeRp!: number;
    opdConsultationPeriod!: number;
    daycareFlag!: number;
    opdConsultationFeeStaff!: number;
    offDayRemarks!: string;
    doctorSignature!: string;
    salesRepNo!: number;
    referralSaleMergin!: number;
    refPayType!: string;
    chamberAddress1!: string;
    chamberAddress2!: string;
    qualification!: string;
    degree1!: string;
    degree2!: string;
    degree3!: string;
    degree4!: string;
    remarks!: string;
    emailPersonal!: string;
    emailOfficial!: string;
    passportNo!: string;
    reportingTo!: number;
    drivingLcNo!: string;
    tinNo!: string;
    ssNo!: string;
    faxNo!: string;
    peCareOfAddr!: string;
    placeOfBirth!: string;
    cardNo!: string;
    referralNotTeken: number =0;
    doctorName!: string;
    unit!: string;
    actIpdConsultationFee!: number;
    discAloewd!: number;
    DueAloewd!: number;
    saRoleNo!: number;
    docComFlag!: number;
    docComPct!: number;
    companyNo!: number;
    splType!: number;
    rankNo!: number;

    // setDoctorNo(_doctorNo: number) {
    //     this.doctorNo = _doctorNo;
    // }

    // setDoctorId(_doctorId: string) {
    //     this.doctorId = _doctorId;
    // }

    // setFirstName(_firstName: string) {
    //     this.firstName = _firstName;
    // }

    // setQualification(_qualification: string) {
    //     this.qualification = _qualification;
    // }
    // setChamberAddress1(_chamberAddress1: string) {
    //     this.chamberAddress1 = _chamberAddress1;
    // }
    // setChamberAddress2(_chamberAddress2: string) {
    //     this.chamberAddress2 = _chamberAddress2;
    // }
    // setDegree1(_degree1: string) {
    //     this.degree1 = _degree1;
    // }

    // setDoctorSignature(_doctorSignature: string) {
    //     this.doctorSignature = _doctorSignature;
    // }
}


