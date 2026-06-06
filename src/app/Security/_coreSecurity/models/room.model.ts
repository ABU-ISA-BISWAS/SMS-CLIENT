import { Resource } from '../../../core/models/resource.model';

export class Room extends Resource {
  declare id: number;
  buildingNo!: number;
  buildingName!: string;
  roomCode!: string;
  roomName!: string;
  floorNo!: number;
  roomType!: string;
  capacity!: number;
  activeStatus: number = 1;
  companyNo!: number;
}
