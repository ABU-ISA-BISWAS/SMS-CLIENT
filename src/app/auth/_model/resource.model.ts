
export class Resource {
	id!: number;
	success: boolean | false = true;
	info: boolean | false = false;
	warning: boolean | false = false;
	message!: string;
	valid: boolean | false = false;
	obj: any;
}
