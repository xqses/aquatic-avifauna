import { Component } from '@angular/core';
import { NavigationService } from '../../core/services/navigation.service';
import { BehaviorSubject, map, merge, Observable, of, take } from 'rxjs';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AppPath } from '../../core/consts';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpenSubject$ = new BehaviorSubject(false);
  menuOpen$ = this.menuOpenSubject$.asObservable();

  isLargeViewport$ = this.appService.viewportWidthObserver$.pipe(
    map((width) => width >= 768)
  );
  navVisible$ = merge(this.isLargeViewport$, this.menuOpen$);
  toggleNav() {
    this.menuOpen$
      .pipe(take(1))
      .subscribe((menuOpen) => this.menuOpenSubject$.next(!menuOpen));
  }

  availablePaths$: Observable<AppPath[]>;
  // This would probably be an Observable in practice since we would reach out to an API to check user privileges

  runningInBrowser = this.appService.isRunningInBrowser;
  constructor(
    private appService: AppService,
    private navigationService: NavigationService,
    private userService: UserService
  ) {
    this.availablePaths$ = of(this.userService.resolveAvailablePaths());
  }

  trackByPath(index: number, path: AppPath) {
    return path.name;
  }

  async goto(path: AppPath) {
    return await this.navigationService.goto(path.route);
  }

  async goToHome() {
    return await this.navigationService.goto('');
  }
}
