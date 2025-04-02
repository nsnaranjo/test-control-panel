import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-user-actions-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './user-actions-chart.component.html',
  styleUrl: './user-actions-chart.component.scss',
})
export class UserActionsChartComponent {
  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%',
    },
    legend: {
      top: '0',
      left: 'center',
      itemWidth: 20,
      itemHeight: 12,
      textStyle: {
        fontSize: 12,
      },
      data: ['Reinicio automático', 'Detener', 'Iniciar', 'Reinicio Manual'],
    },
    series: [
      {
        name: 'Acciones de Usuario',
        type: 'funnel',
        width: '70%',
        height: '80%',
        top: '20%',
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          fontSize: 12,
          fontWeight: 'normal',
          color: '#000',
        },
        itemStyle: {
          borderWidth: 0,
        },
        emphasis: {
          label: {
            fontSize: 16,
          },
        },
        data: [
          {
            value: 200,
            name: 'Reinicio automático',
            itemStyle: { color: '#30B08B' },
          },
          {
            value: 180,
            name: 'Detener',
            itemStyle: { color: '#84E371' },
          },
          {
            value: 120,
            name: 'Iniciar',
            itemStyle: { color: '#FFCA74' },
          },
          {
            value: 80,
            name: 'Reinicio Manual',
            itemStyle: { color: '#FFE3B3' },
          },
        ],
      },
    ],
  };
}
