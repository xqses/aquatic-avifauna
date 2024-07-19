import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { map, Observable } from 'rxjs';

const wideViewportGreeting =
  'Use the navigation links above to explore your portfolio';
const narrowViewportGreeting =
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
    this.greetingText$ = this.appService.viewportWidthObserver$.pipe(
      map((width) =>
        width >= 768 ? wideViewportGreeting : narrowViewportGreeting
      )
    );
  }
}
