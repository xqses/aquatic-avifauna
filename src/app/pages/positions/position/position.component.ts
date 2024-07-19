import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Position, PositionsService } from '../positions.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-position',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './position.component.html',
  styleUrl: './position.component.css',
})
export class PositionComponent {
  @ViewChild('chart') chart?: ChartComponent;
  chartOptions$: Observable<ChartOptions>;
  nPoints = 10; // Default to 10 data points, let user select
  @Input() data!: Position;
  @Input() index!: number;

  constructor(private positionsService: PositionsService) {
    this.chartOptions$ = this.positionsService.positionTimeseries$.pipe(
      map((timeseries) => {
        // I.e., the series for this particular position
        let positionSeries = timeseries.map((series) => series[this.index]);
        if (positionSeries.length > this.nPoints) {
          positionSeries = positionSeries.slice(
            timeseries.length - this.nPoints
          );
        }

        const values = positionSeries.map((series) => series.value);

        return {
          series: [
            {
              name: this.data.instrumentCurrency,
              data: values,
            },
          ],
          chart: {
            height: 250,
            type: 'line',
            zoom: {
              enabled: false,
            },
            animations: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'straight',
          },
          title: {
            text: `${this.data.instrumentName} - ${this.data.instrumentType}`,
            align: 'left',
          },
          grid: {
            row: {
              colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
              opacity: 0.5,
            },
          },
          xaxis: {
            categories: positionSeries.map((series) => series.positionDate),
          },
        };
      })
    );
  }
}
