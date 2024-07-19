import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private navigationService: NavigationService
  ) {}
  textInput = '';

  submitLogin() {
    const success = this.userService.authenticate(this.textInput);
    if (success) {
      this.navigationService.goto('');
    }
  }
}
