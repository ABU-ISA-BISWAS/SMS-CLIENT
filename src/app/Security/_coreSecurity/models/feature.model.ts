import { Resource } from '../../../auth/_model/resource.model'; 
import { ModuleModel } from './module.model';

export class FeatureModel extends Resource {

    declare id: number;
    activeStatus: number=1;
    hideFlag: number=0;
    submenuType!: number;
    submenuName!: number;
    menuEntity!: ModuleModel;
    submenuId!: string;
    slNo!: number;
    rpShowFooter!: number;
    defReportServer!: number;
    ssUploadedOn!: Date;
    companyNo!: number;
    pageLink!: number;
    rpOutput!: number;
    submenuNameJava!: number;
    rpShowPageNo!: number;
    rpShowPrintDate!: number;
    canCreate!: number;
    canRemove!: number;
    canModify!: number;
    canView!: number;
    rpShowPrintedBy!: number;
    rpShowHeader!: number;
    iconName!: string;
    
    //transient field
    isGranted!: boolean;

}