import { LookupDetail } from '../models/lookup-details.model';

export class LookupDetailSerializer {
  fromJson(json: any): LookupDetail {
    const lookupDetail = new LookupDetail();

    lookupDetail.id = json.id;
    lookupDetail.detailName = json.dtlName;
    lookupDetail.lookupNumber = json.lookupNo;
    lookupDetail.detailDescription = json.dtlDescription;
    lookupDetail.lookupdtlParentNo = json.lookupdtlNoParent;
    lookupDetail.serialNo = json.slNo;

    return lookupDetail;
  }

  toJson(lookupDetail: LookupDetail): any {
    return {
      id: lookupDetail.id,
      dtlName: lookupDetail.detailName,
      dtlDescription: lookupDetail.detailDescription,
      lookupNo: lookupDetail.lookupNumber,
      lookupdtlNoParent: lookupDetail.lookupdtlParentNo,
      slNo: lookupDetail.serialNo,
    };
  }

  toArray(json: any): LookupDetail[] {
    let newlookupDetailList: LookupDetail[] = [];
    if (!json) return newlookupDetailList;

    json.forEach((element: any) => {
      newlookupDetailList.push(this.fromJson(element));
    });
    return newlookupDetailList;
  }
}
