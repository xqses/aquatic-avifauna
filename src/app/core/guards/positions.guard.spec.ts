import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { positionsGuard } from './positions.guard';

describe('positionsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => positionsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
