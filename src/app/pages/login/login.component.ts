import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NavigationService } from '../../core/services/navigation.service';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  runningInBrowser = this.appService.isRunningInBrowser;
  constructor(
    private userService: UserService,
    private navigationService: NavigationService,
    private appService: AppService
  ) {}
  textInput = '';

  submitLogin() {
    const success = this.userService.authenticate(this.textInput);
    if (success) {
      this.navigationService.goto('');
    }
  }
}
