import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { UserService } from './core/services/user.service';
import { PositionsService } from './pages/positions/positions.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isAuthenticated$ = this.userService.isAuthenticated$;

  // NOTE: This is a hack to initialize a timeseries subscriber so that when opening the "positions tab" at least parts of the graph will already be generated
  // This makes it look nicer on navigation to positions (but refreshing on the positions page will of course not do anything really)
  // Of couse, in real life we might get a timeseries already from the backend and the "scan" trick in the timeseries Observable will not be necessary
  positionTimeseries$ = this.positionsService.positionTimeseries$;
  constructor(
    private userService: UserService,
    private positionsService: PositionsService
  ) {}
  title = 'aquatic-avifauna';
}
