import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { IBreadcrumb } from '../models';
@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  private readonly _breadcrumbs$ = new BehaviorSubject<IBreadcrumb[]>([]);

  // Observable exposing the breadcrumb hierarchy
  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  constructor(private router: Router) {
    this.fillBreadCrumb();
    this.router.events
      .pipe(
        // Filter the NavigationEnd events as the breadcrumb is updated only when the route reaches its end
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(event => {
        this.fillBreadCrumb();
      });
  }

  fillBreadCrumb() {
    // Construct the breadcrumb hierarchy
    const root = this.router.routerState.snapshot.root;
    const breadcrumbs: any[] = [];
    this.addBreadcrumb(root, [], breadcrumbs);
    // Emit the new hierarchy
    this._breadcrumbs$.next(breadcrumbs);
  }

  private addBreadcrumb(route: ActivatedRouteSnapshot | null, parentUrl: string[], breadcrumbs: any[]) {
    if (route) {
      // Construct the route URL
      const routeUrl = parentUrl.concat(route.url.map(url => url.path));

      // Add an element for the current route part
      if (route.data['breadcrumb'] && !(typeof route.data['breadcrumb'] == 'object' && route.data['breadcrumb'].skip)) {
        const breadcrumb: IBreadcrumb = {
          label: this.getLabel(route.data),
          url: '/' + routeUrl.join('/'),
        };
        if (route.data['icon']) {
          breadcrumb.icon = route.data['icon'];
        }
        breadcrumbs.push(breadcrumb);
      }

      // Add another element for the next route part
      this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
    }
  }

  private getLabel(data: Data) {
    // The breadcrumb can be defined as a static string or as a function to construct the breadcrumb element out of the route data
    return typeof data['breadcrumb'] === 'function' ? data['breadcrumb'](data) : data['breadcrumb'];
  }
}
