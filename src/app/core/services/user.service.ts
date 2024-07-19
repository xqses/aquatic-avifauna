import { Injectable, signal } from '@angular/core';
import { AppService } from '../../app.service';
import { AppPath, paths } from '../consts';
import { BehaviorSubject, of } from 'rxjs';

/**
 * Service class to handle user information, privileges, etc. if available
 */
@Injectable({
  providedIn: 'root',
})
export class UserService {
  userSubject$ = new BehaviorSubject('');
  user$ = this.userSubject$.asObservable();
  authSubject$ = new BehaviorSubject(false);
  isAuthenticated$ = this.authSubject$.asObservable();

  constructor(private appService: AppService) {
    if (this.appService.isRunningInBrowser()) {
      const authInfo = localStorage.getItem('isAuthenticated');
      const userInfo = localStorage.getItem('userInfo');
      if (authInfo && userInfo && JSON.parse(authInfo) && userInfo) {
        this.setUser(true, userInfo);
      } else {
        this.setUser(false, '');
      }
    } else {
      this.setUser(false, '');
    }
  }

  /**
   * Users may have granular access to the app, so we should only allow navigation to selected components if we can resolve that the user should be able to navigate there
   */
  resolveAvailablePaths(): AppPath[] {
    return paths;
  }

  setUser(authenticated: boolean, username: string) {
    this.authSubject$.next(authenticated);
    this.userSubject$.next(username);
    if (this.appService.isRunningInBrowser()) {
      localStorage.setItem('isAuthenticated', JSON.stringify(authenticated));
      localStorage.setItem('userInfo', username);
    }
  }

  authenticate(username: string): boolean {
    if (username.length > 0) {
      this.setUser(true, username);
      return true;
    }
    return false;
  }
}
