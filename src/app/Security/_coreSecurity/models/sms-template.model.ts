import { Resource } from '../../../core/models/resource.model';

export class SmsTemplate extends Resource {
  declare id: number;
  templateCode!: string;
  templateName!: string;
  templateType!: string;
  templateBody!: string;
  templateBodyBn!: string;
  activeStatus: number = 1;
  companyNo!: number;
}
