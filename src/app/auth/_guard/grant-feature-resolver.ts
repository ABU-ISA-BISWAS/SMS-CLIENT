import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { map, Observable } from "rxjs";
import { GrantFeatureService } from "../_service/grant-feature-service";

@Injectable({
    providedIn: 'root'
})
export class GrantFeatureResolver implements Resolve<boolean> {

    constructor(private grantFeatureService: GrantFeatureService) { }

    resolve(): Observable<boolean> {
        return this.grantFeatureService.loadFeatures().pipe(map(() => true));
    }
}
