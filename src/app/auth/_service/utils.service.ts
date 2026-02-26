import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import moment from 'moment';
import { sortBy } from 'sort-by-typescript';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth-service';
import { UserIdleService } from 'angular-user-idle';
import * as XLSX from 'xlsx';
import printJS from 'print-js';
import { FormModel } from '../_model/form.model';

@Injectable({
	providedIn: 'root'
})
export class UtilsService {


	maximumDayForReportCall: any = `${environment.maximumDayForReportCall}`;

	constructor(
		private userIdle: UserIdleService,
		public authService: AuthService
	) { }


	async getCustomCompanyInfo() {

		let flag = false;
		let companyObj = null;

		companyObj = sessionStorage.getItem("customCompanyInfo");

		if (!companyObj) {

			var resp = await this.authService.getLoginCustomLayoutInfo().toPromise();

			if (resp) {

				if (resp.success && resp.obj && !flag) {

					for (var company of resp.obj) {

						if (company.activeStatus === 1) {
							companyObj = company;
							flag = true;
						}

						if (flag) {
							break;
						}
					}
				}

				sessionStorage.setItem("customCompanyInfo", JSON.stringify(companyObj));
				return companyObj;
			}
		}
		else {
			return JSON.parse(companyObj);
		}

	}

	/**
	   * Build url parameters key and value pairs from array or object
	   * @param obj
	   */
	urlParam(obj: any): string {
		return Object.keys(obj)
			.map(k => k + '=' + encodeURIComponent(obj[k]))
			.join('&');
	}

	/**
	 * Simple object check.
	 * @param item
	 * @returns {boolean}
	 */
	isObject(item: any) {
		return item && typeof item === 'object' && !Array.isArray(item);
	}

	/**
	 * Simple object empty check.
	 * @param object
	 * @returns {boolean}
	 */
	isObjectEmpty(obj: any) {
		for (let prop in obj) {
			if (obj.hasOwnProperty(prop))
				return false;
		}
		return true;
	}

	/**
	 * Validate Phone Number.
	 * @param Number
	 * @returns {boolean}
	 */
	isValidatePhoneNumber(number: any) {
		let validateExp = /(^(\+88|0088)?(01){1}[13456789]{1}(\d){8})$/;
		return validateExp.test(number);
	}
	/**
	 * Deep merge two objects.
	 * @param target
	 * @param ...sources
	 * @see https://stackoverflow.com/a/34749873/1316921
	 */
	mergeDeep(target: any, ...sources: any): any {
		if (!sources.length) {
			return target;
		}
		const source = sources.shift();

		if (this.isObject(target) && this.isObject(source)) {
			for (const key in source) {
				if (this.isObject(source[key])) {
					if (!target[key]) {
						Object.assign(target, { [key]: {} });
					}
					this.mergeDeep(target[key], source[key]);
				} else {
					Object.assign(target, { [key]: source[key] });
				}
			}
		}

		return this.mergeDeep(target, ...sources);
	}

	getPath(obj: any, val: any, path?: any) {
		path = path || '';
		let fullpath = '';
		for (const b in obj) {
			if (obj[b] === val) {
				return path + '/' + b;
			} else if (typeof obj[b] === 'object') {
				fullpath =
					this.getPath(obj[b], val, path + '/' + b) || fullpath;
			}
		}
		return fullpath;
	}

	constructDataTableParams(dataTablesParameters: any): HttpParams {
		let params = new HttpParams();

		params = params.append("draw", dataTablesParameters.draw);
		params = params.append("start", dataTablesParameters.start);
		params = params.append("length", dataTablesParameters.length);

		if (dataTablesParameters.search) {
			params = params.append('search' + '[value]', dataTablesParameters.search.value);
			params = params.append('search' + '[regex]', dataTablesParameters.search.regex);
		}
		if (dataTablesParameters.order) {
			for (let order in dataTablesParameters.order) {
				params = params.append('order' + '[' + order + ']' + '[column]', dataTablesParameters.order[order].column);
				params = params.append('order' + '[' + order + ']' + '[dir]', dataTablesParameters.order[order].dir);
			}
		}
		if (dataTablesParameters.columns) {
			let columns = dataTablesParameters.columns;
			for (let column in columns) {
				params = params.append('columns' + '[' + column + ']' + '[data]', columns[column].data);
				params = params.append('columns' + '[' + column + ']' + '[name]', columns[column].name);
				params = params.append('columns' + '[' + column + ']' + '[searchable]', 'true');
				params = params.append('columns' + '[' + column + ']' + '[orderable]', 'true');
				params = params.append('columns' + '[' + column + ']' + '[search]' + '[value]', '');
				params = params.append('columns' + '[' + column + ']' + '[search]' + '[regex]', 'false');
			}
		}
		return params;
	}

	// Date format as specified format
	getDateStringFromDateAndFormat(_date: Date, format: string): string {
		// return new DatePipe('en-US').transform(_date, format);
		return new DatePipe('en-US').transform(_date, format) ?? '';
	}

	isNumber(value: string | number): boolean {
		return ((value != null) && !isNaN(Number(value.toString())));
	}

	gridSelectedLength(gridObj: any): any {
		return gridObj.rows('.selected').data().length;
	}

	gridSelectedRowData(gridObj: any): any {
		return gridObj.rows('.selected').data();
	}

	gridSelectedRowObjects(gridObj: any): any {
		return jQuery.map(gridObj.rows('.selected').data(), function (item) {
			return item;
		});
	}

	gridAllCellValue(gridObj: any, colName: string): any {
		let cellVal: any[] = [];
		gridObj.rows().data().filter((element: any) => {
			cellVal.push(element[colName]);
		})
		return cellVal;
	}

	gridCurrentObjectList(gridObj: any): any {
		let objList: any[] = [];
		gridObj.rows().data().filter((element: any) => {
			objList.push(element);
		})
		return objList;
	}



	gridSelectedCell(gridObj: any, colName: string): any {
		let cellVal: any[] = [];
		gridObj.rows('.selected').data().filter((element: any) => {
			cellVal.push(element[colName]);
		})

		return cellVal;
	}

	createFormElement(formModel: FormModel): any {

		let form = document.createElement("form");
		form.setAttribute('name', formModel.formName);
		form.setAttribute('method', formModel.formMethod);
		form.setAttribute('action', formModel.formAction);
		form.setAttribute('target', formModel.formTarget);

		return form;
	}

	dynamicFormElement(formElement: any): any {

		let inputField = document.createElement(formElement.elm);
		if (formElement.elm == 'input' || formElement.elm == 'submit') {
			inputField.setAttribute('type', formElement.type);
			inputField.setAttribute('name', formElement.name)
			inputField.value = formElement.value;
			if (formElement.type == 'checkbox' || formElement.type == 'radio') {
				inputField.checked = 'checked'
			}
		}
		if (formElement.elm == 'select') { }
		return inputField;
	}


	nullCheck(value: any): any {
		if (value == null) {
			return "";
		}
		return value;
	}

	/**
	 * two array of object merge with remove duplicate.
	 * @param firstArray
	 * @param secondArray
	 * @param field to compare
	 * @see https://stackoverflow.com/questions/46869330/most-efficient-way-to-combine-arrays-removing-duplicates
	 */
	// union = (arr1: any, arr2: any, key: any) => [... // spread to an array
	// 	new Map(arr1.concat(arr2).map(o => [o[key], o])) // concat and initialize the map
	// 		.values()]; // get the values iterator

	union = (arr1: any, arr2: any, key: any) => [
		...Array.from(
			new Map(arr1.concat(arr2).map((o: any) => [o[key], o])).values()
		),
	];

	printFormat(formatKey: string) {

		let reportFormatMap = new Map();

		reportFormatMap.set('PDF', 'application/pdf');
		reportFormatMap.set('XLSX', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		reportFormatMap.set('DOCX', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

		return reportFormatMap.get(formatKey);
	}

	fileDownload(data: any) {
		const element = document.createElement('a');
		element.href = URL.createObjectURL(data.file);
		element.target = "_blank";
		element.download = data.filename;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	fileOpenNewTab(data: any) {
		const fileURL = URL.createObjectURL(data.file);
		window.open(fileURL, data.filename);
	}

	fileOpenSameTab(data: any) {
		const fileURL = URL.createObjectURL(data.file);
		printJS(fileURL);

	}
	openFileNewTab(src: any, ext: string, name?: string) {
		const fileBlob = new Blob([src], { type: this.printFormat(ext) });
		const fileURL = URL.createObjectURL(fileBlob);
		window.open(fileURL, name ? name : ('new_file.' + ext));
	}

	getEnumKeyByEnumValue(myEnum: any, enumValue: any) {
		let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
		return keys.length > 0 ? keys[0] : null;
	}

	groupByItemKey(xs: any, key: any): any[] {
		return xs.reduce(function (rv: any, x: any) {
			(rv[x[key]] = rv[x[key]] || []).push(x);
			return rv;
		}, {});
	};

	removeLocalStorgeByKey(key: string): void {
		let arr = []; // Array to hold the keys
		// Iterate over localStorage and insert the keys that meet the condition into arr
		for (let i = 0; i < localStorage.length; i++) {
			// if (localStorage.key(i).substring(0, 5) == key) {
			// 	arr.push(localStorage.key(i));
			// }

			const currentKey = localStorage.key(i);
			if (currentKey && currentKey.substring(0, 5) == key) {
				arr.push(currentKey);
			}
		}

		// Iterate over arr and remove the items by key
		for (let i = 0; i < arr.length; i++) {
			localStorage.removeItem(arr[i]);
		}
	}

	calculateTherapyDuration(timeDuration: string, duration: number, durationMu: string) {
		if (!timeDuration || !duration || !durationMu) {
			return;
		}

		let totalTimeDuration: any = 0;
		let totalDuration: any = 0;
		let therapyDuration: any = 0;

		if (timeDuration === 'Daily') {
			totalTimeDuration = 1;
		} else if (timeDuration === 'Alt Day') {
			totalTimeDuration = 0.5;
		}

		if (durationMu === 'Week(s)') {
			totalDuration = (duration * 7);
		} else if (durationMu === 'Day(s)') {
			totalDuration = duration;
		}

		therapyDuration = totalDuration * totalTimeDuration;

		return Math.ceil(therapyDuration);
	}

	margeMedicineList(medicineArr: any[], continueMedicineArr: any[]) {
		continueMedicineArr.forEach(medicine => {
			if (!this.checkDuplicateItem(medicineArr, medicine)) {
				medicineArr.push(medicine);
			}
		});
		return medicineArr;
	}

	checkDuplicateItem(medicineList: any, medicine: any) {
		const data = medicine;

		return medicineList.some((item: any) => {
			if (data.favouriteNo && item.id == data.favouriteNo) {
				return true;
			} else if (data.brandName && item.brandName == data.brandName) {
				return true;
			} else if (data.favouriteVal && item.preDiagnosisVal == data.favouriteVal) {
				return true;
			} else if (item.preDiagnosisVal && item.preDiagnosisVal == data.preDiagnosisVal) {
				return true;
			} else if (item.preDiagnosisVal && item.preDiagnosisVal == data) {
				return true;
			} else { return false; }
		});
	}

	// base64toImageFile(fileName: any, base64: any): any {
	// 	let blob: any = fetch(base64).then(res => res.blob);
	// 	return new File([blob], fileName, { type: 'image/png' });
	// }

	// base64toBlob(b64Data, contentType, sliceSize) {
	// 	contentType = contentType || '';
	// 	sliceSize 	= sliceSize   || 512;
	// 	let byteCharacters = atob(b64Data);
	// 	let byteArrays 	   = [];
	// 	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
	// 		let slice = byteCharacters.slice(offset, offset + sliceSize);
	// 		let byteNumbers = new Array(slice.length);
	// 		for (let i = 0; i < slice.length; i++) {
	// 			byteNumbers[i] = slice.charCodeAt(i);
	// 		}
	// 		let byteArray = new Uint8Array(byteNumbers);
	// 		byteArrays.push(byteArray);
	// 	} 
	// 	return new Blob(byteArrays, {type: contentType});
	// }

	base64toImageFile(fileName: any, base64: any): any {
		if (base64) {
			let b64plitArr = base64.split(";");
			let contentType = b64plitArr[0].split(":")[1];
			let b64Data = b64plitArr[1].split(",")[1];
			let blob = this.base64toBlob(b64Data, contentType);
			fileName = fileName + '.' + blob.type.split('/')[1];
			return new File([blob], fileName, { type: blob.type });
		} else {
			console.log('Base64 not found.');
		}
	}

	base64toBlob(b64Data: any, contentType: any) {
		contentType = contentType || '';
		const byteCharacters = atob(b64Data);
		const byteNumbers = new Array(byteCharacters.length);
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i);
		}
		const byteArray = new Uint8Array(byteNumbers);
		return new Blob([byteArray], { type: contentType });
	}

	resizeB64Images(base64: any, height: any, width: any, callback: any) {
		let resizeB64 = null;
		if (base64) {
			const img = new Image();
			img.src = base64 as string;
			img.onload = () => {
				const imgCanvas: HTMLCanvasElement = document.createElement('canvas');
				imgCanvas.height = height;
				imgCanvas.width = width;
				imgCanvas.getContext('2d')?.drawImage(img, 0, 0, height, width);
				const contentType = base64.split(";")[0].split(":")[1];
				resizeB64 = imgCanvas.toDataURL(contentType);
				callback(resizeB64)
			}
		}
	}

	uploadXlsxFile(file: File): Observable<string> {
		let workBook: any = null;
		let jsonData = null;
		const reader = new FileReader();
		let dataString = new Subject<string>();

		reader.onload = (event) => {

			const data = reader.result;
			workBook = XLSX.read(data, { type: 'binary' });

			jsonData = workBook.SheetNames.reduce((sheets: any, index: any) => {
				const sheet = workBook.Sheets[index];
				sheets[index] = XLSX.utils.sheet_to_json(sheet);
				return sheets[index];
			}, {});
			const str = JSON.stringify(jsonData);
			dataString.next(str);

			dataString.complete();
		}

		if (file) {
			reader.readAsBinaryString(file);
		}

		return dataString.asObservable();
	}
	//-start-----DataTable Global Search input event-------
	public dataTableGlobalSearch(dtObj: any) {
		// let cusThis = this;
		$('.dataTables_filter input').unbind().bind('keyup', function (e: any) {
			// cusThis.dataTableGlobalInnerSearch();
			if (e.keyCode === 13 && e.target.value && e.target.value.length > 1) {
				dtObj.search(e.target.value).draw();
			} else if (!e.target.value) {
				dtObj.search('').draw();
			}
		});
	}
	private dataTableGlobalInnerSearch() {
		let input, filter, tBody, tr, td, i, txtValue;
		input = $(".dataTables_filter").find('input');
		filter = input.val()?.toUpperCase() || '';
		tBody = $(".dataTable").find('tbody');
		tr = tBody.find("tr");
		for (i = 0; i < tr.length; i++) {
			td = tr[i].getElementsByTagName("td");
			let trDis = false;
			for (let j = 0; j < td.length; j++) {
				const element = td[j];
				txtValue = element.textContent || element.innerText;
				if (txtValue.toUpperCase().indexOf(filter) > -1) {
					trDis = true;
				}
			}
			if (trDis) {
				tr[i].style.display = "";
			} else {
				tr[i].style.display = "none";
			}
		}
	}
	//-end-----DataTable Global Search input event-------

	//==start: Find Date By DateCriteria===================
	findDateByDateCriteria(dateCriteria: string): any {
		let returnObj: any = {};
		switch (dateCriteria) {
			case 'TODAY':
				returnObj = { 'fromDate': moment().toDate(), 'toDate': moment().toDate() };
				break;
			case 'THIS_WEEK':
				returnObj = {
					'fromDate': moment().startOf('week').toDate(),
					'toDate': moment().endOf('week').toDate()
				};
				break;
			case 'LAST_WEEK':
				returnObj = {
					'fromDate': moment().subtract(1, 'weeks').startOf('week').toDate(),
					'toDate': moment().subtract(1, 'weeks').endOf('week').toDate()
				};
				break;
			case 'THIS_MONTH':
				returnObj = {
					'fromDate': moment().startOf('month').toDate(),
					'toDate': moment().endOf('month').toDate()
				};
				break;
			case 'LAST_MONTH':
				returnObj = {
					'fromDate': moment().subtract(1, 'month').startOf('month').toDate(),
					'toDate': moment().subtract(1, 'month').endOf('month').toDate()
				};
				break;
			case 'THIS_YEAR':
				returnObj = {
					'fromDate': moment().startOf('year').toDate(),
					'toDate': moment().endOf('year').toDate()
				};
				break;
			default:
				returnObj = { 'fromDate': moment().toDate(), 'toDate': moment().toDate() };
				break;
		}
		return returnObj;
	}
	//==end: Find Date By DateCriteria===================

	dateRangeValidation(fromDate: any, toDate: any): any {
		if (fromDate && toDate) {
			fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0);
			toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0);
			let totalDays = Math.round((toDate.getTime() - fromDate.getTime()) / (24 * 3600 * 1000));
			if (totalDays >= 0) { totalDays = totalDays + 1 };
			let returnObj: any = { isValidate: false, messege: null, fromDate: fromDate, toDate: toDate, totalDays: totalDays };
			if (totalDays <= this.maximumDayForReportCall) {
				returnObj.isValidate = true;
				returnObj.messege = 'Valid';
			} else {
				returnObj.isValidate = false;
				returnObj.messege = "You can't select more then " + this.maximumDayForReportCall + " days.";
			}
			return returnObj;
		} else {
			return { isValidate: false, messege: 'From Date or To Date not found.' };
		}
	}
	serializeRegisterPatient(data: any, callback: any) {
		data.forEach((element: any) => {
			if (element.personalNumber) {
				element.serialNo = 1
				if (element.personalNumber.includes("W")) {
					element.serialNo = 2
				} if (element.personalNumber.includes("H")) {
					element.serialNo = 3
				} if (element.personalNumber.includes("S")) {
					element.serialNo = 4
				} if (element.personalNumber.includes("D")) {
					element.serialNo = 5
				} if (element.personalNumber.includes("F")) {
					element.serialNo = 6
				} if (element.personalNumber.includes("M")) {
					element.serialNo = 7
				} if (element.personalNumber.includes("FL")) {
					element.serialNo = 8
				} if (element.personalNumber.includes("ML")) {
					element.serialNo = 9
				} if (element.personalNumber.includes("MISC")) {
					element.serialNo = 10
				}
			}
			callback(data.sort(sortBy('serialNo')));
		});
	}

	groupByItemType(detailsArry: any) {
		let groups = detailsArry.reduce(function (obj: any, item: any) {
			obj[item.itemTypeNo] = obj[item.itemTypeNo] || [];
			obj[item.itemTypeNo].push(item);
			return obj;
		}, {})
		return Object.keys(groups).map(function (key) {
			return { itemTypeNo: key, details: groups[key] };
		})
	}

	groupByStoreItemType(detailsArry: any) {
		let groups = detailsArry.reduce(function (obj: any, item: any) {
			if (item.storeTypeFlag == 'A') {
				item.storeTypeName = 'OTHERS';
			}
			item.storeItemTypeName = item.storeTypeName ? (item.storeTypeName.toUpperCase().replace("STORE", "")).trim() : "OTHERS";
			obj[item.storeTypeFlag] = obj[item.storeTypeFlag] || [];
			obj[item.storeTypeFlag].push(item);
			return obj;
		}, {})
		return Object.keys(groups).map(function (key) {
			return { storeTypeFlag: key, details: groups[key] };
		})
	}

	medicalStoreItemTypeWiseFilter(itemList: any) {
		if (itemList && itemList.length > 0) {
			itemList.sort((a: any, b: any) => (a.storeTypeFlag > b.storeTypeFlag) ? 1 : ((b.storeTypeFlag > a.storeTypeFlag) ? -1 : 0))
			return {
				chemoDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'CIS' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'CIS' }) : [],
				disposaltDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'DIS' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'DIS' }) : [],
				fluidDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'FLD' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'FLD' }) : [],
				injectionDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'INJ' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'INJ' }) : [],
				syrupCreamDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'CRM' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'CRM' }) : [],
				tabletCapsuleDataList: itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'TC' }) ? itemList.filter((elm: any) => { return elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'TC' }) : [],
				otherDataList: itemList.filter((elm: any) => { return !elm.storeTypeFlag || (elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'A') }) ? itemList.filter((elm: any) => { return !elm.storeTypeFlag || (elm.storeTypeFlag && (elm.storeTypeFlag).toUpperCase().trim() === 'A') }) : [],
			}
		} else {
			return null;
		}
	}

	getIndexByProperty(items: any[], prop: string, val: any): number {
		return items.findIndex(item => item[prop] == val);
	}


	autoLogoutForIdleBrowser() {
		/***Angular User Idle Time API ***
			startWatching : Start watching for user inactivity.
			onTimerStart  : Start watching when user idle is starting.
			ping$         : Ping is used if you want to perform some action periodically every n-minutes in lifecycle of timer (from start timer to timeout)
			onTimeout     : Start watch when time is up.
			stopWatching  : Stop watching;
		***/
		this.userIdle.startWatching();
		this.userIdle.onTimerStart().subscribe(count => {
			if (count) {
				this.userIdle.resetTimer();
				this.userIdle.stopWatching();
				this.authService.logout();
			}
		});
		// this.userIdle.ping$.subscribe(ping => console.log('Ping Countdown :=>> ',ping));
		this.userIdle.onTimeout();
		// .subscribe(() => {
		// 	console.log('Call Logout'),  
		// 	this.userIdle.resetTimer();
		// 	this.userIdle.stopWatching();
		// 	this.authService.logout();
		// }); 
	}

	downloadFileWithName(res: any, fileName: string, printF: string) {
		const fileData = {
			file: new Blob([res], { type: this.printFormat(printF) }),
			filename: fileName + '.' + printF
		};
		if (printF == 'PDF') {
			this.fileOpenNewTab(fileData);
		} else {
			this.fileDownload(fileData);
		}
	}

}

export function isInteger(value: any): value is number {
	return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}

export function today(): Date {
	return moment().toDate();
}

export function isString(value: any): value is string {
	return typeof value === 'string';
}

export function isHasFileData(file: Blob): boolean {
	if (file.size == 0) {
		return false;
	}
	return true;
}

export function userPasswordValidation(newPassword: String): string {

	var capitalLetter = '^(?=.*?[A-Z])';
	var smallLetter = '^(?=.*?[a-z])';
	var digit = '^(?=.*?[0-9])';
	var specialCarrecter = '(?=.*?[#?!@$%^&*-])';

	if (newPassword != null) {

		if (newPassword.length < 6) {

			return "Password must be at least 06 character. Password must contain at least one upper case letter, one lower case letter and one digit and one special character.";
		}

		else if (newPassword.match(capitalLetter) == null) {

			return "Password must be contain At least one upper case English letter";
		}

		else if (newPassword.match(smallLetter) == null) {

			return "Password must be contain At least one lower case English letter";
		}

		else if (newPassword.match(digit) == null) {


			return "Password must be contain  At least one digit";
		}

		else if (newPassword.match(specialCarrecter) == null) {

			return "Password must be contain  At least one special character[#?!@$%^&*-]";
		}
		else {
			return "success";
		}
	} else {
		return "Password is blank";
	}
}




