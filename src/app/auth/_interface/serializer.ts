import { Resource } from "../_model/resource.model";

export interface Serializer {
    fromJson(json: any): Resource;
    toJson(resource: Resource): any;
}
