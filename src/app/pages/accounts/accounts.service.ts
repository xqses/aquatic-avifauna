import { Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { BehaviorSubject, Observable, ReplaySubject, shareReplay } from 'rxjs';
import { AppService } from '../../app.service';

export interface AccountData {
  id: string;
  accountId: string;
  bank: string;
  balance: number;
  currency: string;
}

export interface AccountFilters {
  sortKey: keyof AccountData;
  sortOrder: 'asc' | 'desc';
  searchString: string;
}

export type AccountsDataDTO = AccountData[];

const MOCK_DATA_URL = 'https://private-9b37c2-wlb.apiary-mock.com/accounts';
const DEFAULT_FILTERS: AccountFilters = {
  sortKey: 'id',
  sortOrder: 'asc',
  searchString: '',
};

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  filterSubject$: BehaviorSubject<AccountFilters>;
  appliedFilters$: Observable<AccountFilters>;

  constructor(
    private httpService: HttpService,
    private appService: AppService
  ) {
    this.filterSubject$ = this.initializeFilters();
    this.appliedFilters$ = this.filterSubject$.pipe(shareReplay(1));
  }

  getAccountsData(): Observable<AccountsDataDTO> {
    const request = { baseUrl: MOCK_DATA_URL, params: { ccy: 'SEK' } };
    return this.httpService.get<AccountsDataDTO>(request);
  }

  initializeFilters(): BehaviorSubject<AccountFilters> {
    if (this.appService.isRunningInBrowser()) {
      const filters = localStorage.getItem('accountFilters');
      if (filters) {
        const parsedFilters = JSON.parse(filters);
        return new BehaviorSubject<AccountFilters>(parsedFilters);
      }
    }
    return new BehaviorSubject<AccountFilters>(DEFAULT_FILTERS);
  }

  setFilters(newFilters: AccountFilters) {
    this.filterSubject$.next(newFilters);
    if (this.appService.isRunningInBrowser()) {
      localStorage.setItem('accountFilters', JSON.stringify(newFilters));
    }
  }
}
