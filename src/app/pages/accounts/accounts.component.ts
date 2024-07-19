import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  AccountData,
  AccountFilters,
  AccountsDataDTO,
  AccountsService,
} from './accounts.service';
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  Observable,
  take,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppService } from '../../app.service';
import { FormsModule } from '@angular/forms';
import { isString } from '../../core/utils';
import { FilterInputComponent } from '../../components/filter-input/filter-input.component';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterInputComponent, CardComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  @ViewChild('accountsContainer') accountsContainer!: ElementRef;
  filteredAccountsData$: Observable<AccountsDataDTO>;
  sortInfo$: Observable<{ key: keyof AccountData; order: 'asc' | 'desc' }>;
  accountsHeaders!: string[];
  isLargeViewport$: Observable<boolean> =
    this.appService.viewportWidthObserver$.pipe(map((width) => width > 800)); // Consider the 800 here to be an arbitrary judgment

  isRefreshing = false;
  sortMenuOpen = false;
  constructor(
    private accountsService: AccountsService,
    private appService: AppService
  ) {
    this.filteredAccountsData$ = combineLatest([
      this.accountsService.appliedFilters$,
      this.accountsService.getAccountsData(),
    ]).pipe(map(([filters, data]) => this.applyFilters(filters, data)));
    this.sortInfo$ = this.accountsService.appliedFilters$.pipe(
      map((filters) => ({ key: filters.sortKey, order: filters.sortOrder }))
    );
  }

  applyFilters(filters: AccountFilters, accountsData: AccountsDataDTO) {
    if (filters.searchString.length > 1) {
      accountsData = accountsData.filter((account) =>
        account.accountId.includes(filters.searchString)
      );
    }
    accountsData = accountsData.sort((a, b) => {
      const aValue = a[filters.sortKey];
      const bValue = b[filters.sortKey];

      if (isString(aValue) && isString(bValue)) {
        if (filters.sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (filters.sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
      return 0;
    });
    return accountsData;
  }

  updateFilterSearchString(searchString: string) {
    this.accountsService.appliedFilters$
      .pipe(take(1))
      .subscribe((latestFilters) => {
        this.accountsService.setFilters({
          ...latestFilters,
          searchString: searchString,
        });
      });
  }

  updateFilterSort(filterKey: keyof AccountData) {
    this.accountsService.appliedFilters$
      .pipe(take(1))
      .subscribe((latestFilters) => {
        if (latestFilters.sortKey === filterKey) {
          this.accountsService.setFilters({
            ...latestFilters,
            sortOrder: latestFilters.sortOrder === 'asc' ? 'desc' : 'asc',
          });
        } else {
          this.accountsService.setFilters({
            ...latestFilters,
            sortKey: filterKey,
            sortOrder: 'asc',
          });
        }
      });
  }

  trackByHeader(index: number, key: string) {
    return key;
  }

  trackByAccountId(index: number, account: AccountData) {
    return account.accountId;
  }

  refreshAccountData() {
    this.isRefreshing = true;
    this.filteredAccountsData$ = combineLatest([
      this.accountsService.appliedFilters$,
      this.accountsService.getAccountsData(),
    ]).pipe(
      map(([filters, data]) => this.applyFilters(filters, data)),
      tap(() => (this.isRefreshing = false)) // wish I could use finalize here, but oh well
    );
  }

  toggleSortMenu() {
    this.sortMenuOpen = !this.sortMenuOpen;
  }
}
