import { Injectable } from '@angular/core';
import {
  GetRequestOptions,
  HttpService,
} from '../../core/services/http.service';
import { PSK } from '../../core/consts';
import {
  interval,
  map,
  Observable,
  scan,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';

/**
 * The position data returned from the position "microservice"
 */
export type PositionDataDTO = PositionData[];

export interface PositionData {
  account_id: number;
  position_date: number;
  export_date: number;
  instrument_id: string;
  instrument_name: string;
  instrument_type: string;
  instrument_currency: string;
  quantity: number;
  price: number;
  value: number;
}

export interface Position {
  quantity: number;
  price: number;
  value: number;
  instrumentName: string;
  instrumentType: string;
  instrumentCurrency: string;
  positionDate: string;
}

// Fake "position" service
const SERVICE_HOST = 'https://aquatic-avifauna.dahlstedtolle.workers.dev';

@Injectable({
  providedIn: 'root',
})
export class PositionsService {
  updatingPositionData$: Observable<Position[]>;
  positionTimeseries$: Observable<Position[][]>;

  constructor(private httpService: HttpService) {
    this.updatingPositionData$ = this.getUpdatingPositionData();
    this.positionTimeseries$ = this.getPositionTimeseries();
  }

  getPositionData() {
    const options: GetRequestOptions = {
      baseUrl: SERVICE_HOST,
      headers: { 'X-Custom-PSK': PSK },
    };
    return this.httpService.get<PositionDataDTO>(options).pipe(shareReplay(1));
  }

  getUpdatingPositionData() {
    return interval(3000).pipe(
      startWith(0),
      switchMap(() =>
        this.getPositionData().pipe(
          map((rawPositionsData) => this.mapPositionData(rawPositionsData))
        )
      )
    );
  }

  mapPositionData(rawPositionData: PositionDataDTO): Position[] {
    return rawPositionData.map((positionData) => ({
      quantity: positionData.quantity,
      price: Number.parseFloat(positionData.price.toFixed(2)),
      value: Number.parseFloat(positionData.value.toFixed(2)),
      instrumentName: positionData.instrument_name,
      instrumentCurrency: positionData.instrument_currency,
      instrumentType: positionData.instrument_type,
      positionDate: new Date(positionData.position_date).toLocaleTimeString(
        'sv-SE'
      ),
    }));
  }

  getPositionTimeseries() {
    return this.updatingPositionData$.pipe(
      scan((acc: Position[][], value: Position[]) => [...acc, value], []),
      shareReplay(1)
    );
  }
}
