import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { map, Observable, of } from 'rxjs';

const WIDE_VIEWPORT_GREETING =
  'Use the navigation links above to explore your portfolio';
const NARROW_VIEWPORT_GREETING =
  'Use the navigation menu to explore your portfolio';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  user$: Observable<string> = this.userService.user$;
  greetingText$: Observable<string>;
  constructor(
    private userService: UserService,
    private appService: AppService
  ) {
    this.greetingText$ = this.appService.isRunningInBrowser
      ? this.appService.viewportWidthObserver$.pipe(
          map((width) =>
            width >= 768 ? WIDE_VIEWPORT_GREETING : NARROW_VIEWPORT_GREETING
          )
        )
      : of(WIDE_VIEWPORT_GREETING);
  }
}
