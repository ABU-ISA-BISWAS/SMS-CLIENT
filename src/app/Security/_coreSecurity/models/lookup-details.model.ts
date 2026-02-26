import { Resource } from '../../../auth/_model/resource.model';

export class LookupDetail extends Resource {
  override id: number = 0;
  detailName: string = '';
  lookupNumber: number = 0;
  createdDate: string = '';
  detailDescription: string = '';
  lookupdtlParentNo: number = 0;
  serialNo: number = 0;

  constructor(
    id?: number | null,
    detailName?: string,
    lookupNumber?: number | null,
    detailDescription?: string,
  ) {
    super(); // call base constructor if needed
    this.id = id ?? 0;
    if (detailName !== undefined) this.detailName = detailName;
    if (lookupNumber !== undefined) this.lookupNumber = lookupNumber ?? 0;
    if (detailDescription !== undefined)
      this.detailDescription = detailDescription;
  }

  setLookupNumber(lookupNumber: number) {
    this.lookupNumber = lookupNumber;
  }

  setLookupdtlParentNo(lookupdtlParentNo: number) {
    this.lookupdtlParentNo = lookupdtlParentNo;
  }
}
