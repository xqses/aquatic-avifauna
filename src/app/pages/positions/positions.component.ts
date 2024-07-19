import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';
import {
  Position,
  PositionDataDTO,
  PositionsService,
} from './positions.service';
import {
  interval,
  map,
  Observable,
  scan,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { PositionComponent } from './position/position.component';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CardComponent, CommonModule, PositionComponent],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.css',
})
export class PositionsComponent {
  positionsData$: Observable<Position[]>;
  constructor(private positionsService: PositionsService) {
    this.positionsData$ = this.positionsService.updatingPositionData$;
  }
}
