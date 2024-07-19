import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { distinctUntilChanged, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  viewportWidthObserver$: Observable<number> = this.initWidthObserver();
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {}

  get isRunningInBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  initWidthObserver() {
    return new Observable<number>((observer) => {
      const resizeObserver = new ResizeObserver((entries) => {
        this.ngZone.run(() => {
          for (let entry of entries) {
            if (entry.target === document.documentElement) {
              const width = entry.contentRect.width;
              observer.next(width);
            }
          }
        });
      });
      resizeObserver.observe(document.documentElement);
      return () => resizeObserver.unobserve(document.documentElement);
    }).pipe(distinctUntilChanged(), shareReplay(1));
    // Note: this is really unperformant but I don't expect anyone will continously resize their browser window for fun
    // A better solution is probably to throttleTime and solve how to make sure the hamburger menu nav does not show as open briefly on a component level
  }
}
