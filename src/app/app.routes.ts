import { Routes } from '@angular/router';
import { accountsGuard } from './core/guards/accounts.guard';
import { positionsGuard } from './core/guards/positions.guard';
import { homeGuard } from './core/guards/home.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((mod) => mod.HomeComponent),
    canActivate: [homeGuard],
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./pages/accounts/accounts.component').then(
        (mod) => mod.AccountsComponent
      ),
    canActivate: [accountsGuard],
  },
  {
    path: 'positions',
    loadComponent: () =>
      import('./pages/positions/positions.component').then(
        (mod) => mod.PositionsComponent
      ),
    canActivate: [positionsGuard],
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./pages/error/error.component').then((mod) => mod.ErrorComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((mod) => mod.LoginComponent),
    canActivate: [loginGuard],
  },
  { path: '*', redirectTo: 'error' },
];
