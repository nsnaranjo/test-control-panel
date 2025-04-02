import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-system-usage-performance-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './system-usage-performance-chart.component.html',
  styleUrl: './system-usage-performance-chart.component.scss',
})
export class SystemUsagePerformanceChartComponent implements OnChanges {
  @Input() metricData: number[] = [];
  @Input() metricColor: string = '';

  chartOptions: EChartsOption = {
    width: 360,
    height: 246,
    grid: {
      left: '11%',
      right: '5%',
      top: '4%',
      bottom: '15%',
      width: 'auto',
      height: 'auto',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['10:00 am', '12:00 pm', '02:00 pm', '04:00 pm', '06:00 pm'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: this.metricData,
        type: 'line',
        areaStyle: {
          color: this.metricColor,
        },
        lineStyle: {
          color: this.metricColor,
        },
        itemStyle: {
          color: this.metricColor,
        },
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['metricData'] || changes['metricColor']) {
      this.updateChartOptions();
    }
  }

  private updateChartOptions(): void {
    this.chartOptions = {
      ...this.chartOptions,
      series: [
        {
          data: this.metricData,
          type: 'line',
          areaStyle: {
            color: this.metricColor,
          },
          lineStyle: {
            color: this.metricColor,
          },
          itemStyle: {
            color: this.metricColor,
          },
        },
      ],
    };
  }
}
