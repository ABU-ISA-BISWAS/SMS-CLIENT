import { OpdLookupDetail } from '../models/lookup-detail.model';

export class OpdLookupDetailSerializer {

    fromJson(json: any): OpdLookupDetail {
        const opdLookupDetail = new OpdLookupDetail();

        opdLookupDetail.id = json.id;
        opdLookupDetail.lookupdtlNoParent = json.lookupdtlNoParent;
        opdLookupDetail.lookupNo = json.lookupNo;
        opdLookupDetail.dtlName = json.dtlName;
        opdLookupDetail.dtlDescription = json.dtlDescription;
        opdLookupDetail.activeStatus = json.activeStatus;
        opdLookupDetail.slNo = json.slNo;

        return opdLookupDetail;
    }

    toJson(opdLookupDetail: OpdLookupDetail): any {
        return {
            id: opdLookupDetail.id,
            lookupdtlNoParent: opdLookupDetail.lookupdtlNoParent,
            lookupNo: opdLookupDetail.lookupNo,
            dtlName: opdLookupDetail.dtlName,
            dtlDescription: opdLookupDetail.dtlDescription,
            activeStatus: opdLookupDetail.activeStatus,
            slNo: opdLookupDetail.slNo,
        };
    }
}