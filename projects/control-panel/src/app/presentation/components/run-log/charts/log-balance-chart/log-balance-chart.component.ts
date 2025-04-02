import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-log-balance-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './log-balance-chart.component.html',
  styleUrl: './log-balance-chart.component.scss'
})
export class LogBalanceChartComponent {
  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['Log de servicio', 'Log de seguridad', 'Log de red']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Log de servicio',
        type: 'line',
        step: 'start',
        data: [11, 5, 0, 8, 16, 30, 10]
      },
      {
        name: 'Log de seguridad',
        type: 'line',
        step: 'middle',
        data: [20, 30, 12, 34, 40, 30, 10]
      },
      {
        name: 'Log de red',
        type: 'line',
        step: 'end',
        data: [50, 32, 40, 54, 5, 30, 50]
      }
    ]
  };
}
