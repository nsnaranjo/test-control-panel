import { Component } from '@angular/core';
import { LogBalanceChartComponent } from '@components/run-log/charts/log-balance-chart/log-balance-chart.component';
import {
  ServiceBalanceChartComponent,
} from '@components/run-log/charts/service-balance-chart/service-balance-chart.component';
import {
  SystemUsagePerformanceChartComponent,
} from '@components/run-log/charts/system-usage-performance-chart/system-usage-performance-chart.component';
import { UserActionsChartComponent } from '@components/run-log/charts/user-actions-chart/user-actions-chart.component';
import { SystemUsagePerformanceModel } from '@domain/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    LogBalanceChartComponent,
    ServiceBalanceChartComponent,
    SystemUsagePerformanceChartComponent,
    UserActionsChartComponent,
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss',
})
export class StatisticsComponent {
  systemMetrics: SystemUsagePerformanceModel[] = [
    {
      type: 'CPU',
      value: 82,
      color: '#889BD8',
      data: [0, 1500, 3200, 2800, 4200],
    },
    {
      type: 'STORAGE',
      value: 90,
      color: '#94CCA7',
      data: [0, 2000, 4500, 3000, 8000],
    },
    {
      type: 'RAM',
      value: 57,
      color: '#D6B4D5',
      data: [0, 1000, 2000, 1000, 5700],
    },
    {
      type: 'VRAM',
      value: 42,
      color: '#FFC786',
      data: [0, 600, 1800, 900, 4200],
    },
  ];

  selectedMetric: SystemUsagePerformanceModel = this.systemMetrics[0];

  selectMetric(metric: SystemUsagePerformanceModel): void {
    this.selectedMetric = metric;
  }

  isSelected(metric: SystemUsagePerformanceModel): boolean {
    return this.selectedMetric === metric;
  }
}
