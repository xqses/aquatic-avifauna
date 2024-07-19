import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { accountsGuard } from './accounts.guard';

describe('accountsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => accountsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
