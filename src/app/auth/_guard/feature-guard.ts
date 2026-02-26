import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { GrantFeatureService } from '../_service/grant-feature-service';

@Injectable({
  providedIn: 'root'
})
export class FeatureGuard implements CanActivate, CanMatch {

  constructor(private featureService: GrantFeatureService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredFeature = route.data['featureId'];
    console.log("feature code:", requiredFeature);

    if (this.featureService.getFeatures().length > 0) {
      return of(this.checkFeature(requiredFeature));
    }

    return this.featureService.loadFeatures().pipe(
      map(() => this.checkFeature(requiredFeature))
    );
  }

  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
    const requiredFeature = route.data?.['featureId'];
    return of(this.checkFeature(requiredFeature));
  }

  private checkFeature(requiredFeature: string): boolean | UrlTree {
    const features = this.featureService.getFeatures();
    return features.some(f => f.featureCode === requiredFeature)
      ? true
      : this.router.parseUrl('/unauthorized');
  }

}
