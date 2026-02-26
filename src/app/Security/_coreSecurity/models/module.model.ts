import { Resource } from '../../../auth/_model/resource.model'; 
import { FeatureModel } from './feature.model';

export class ModuleModel extends Resource {

    declare id: number;
    activeStatus!: number;
    menuId!: string;
    menuName!: string;
    ssUploadedOn!: Date;
    menuLink!: string;
    menuIcon!: string;
    parentMenuNo!: number;
    slNo!: number;
    menuNameNls!: string;
    subModuleList!: Array<ModuleModel>;
    featureList!: Array<FeatureModel>;
}