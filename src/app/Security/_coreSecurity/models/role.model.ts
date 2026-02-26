import { Resource } from "../../../auth/_model/resource.model"; 

export class RoleModel extends Resource {

	declare id: number;
	roleName!: string;
	activeStatus!: number;
	ssUploadedOn!: Date;
	descr!: string;
	roleId!: string;
	isChange!: boolean;
	
}