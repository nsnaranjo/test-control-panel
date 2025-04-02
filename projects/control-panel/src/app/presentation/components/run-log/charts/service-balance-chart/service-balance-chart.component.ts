import { Component } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-service-balance-chart',
  standalone: true,
  imports: [NgxEchartsModule],
  templateUrl: './service-balance-chart.component.html',
  styleUrl: './service-balance-chart.component.scss',
})
export class ServiceBalanceChartComponent {
  chartOptions: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        return `
          <div style="text-align: left;">
             <span>Servicio</span><br/>
             ${params.marker} <span>${params.name} <strong>${params.value}</strong> </span>
          </div>
        `;
      },
    },
    legend: {
      top: '5%',
      left: 'center',
    },
    series: [
      {
        width: '100%',
        type: 'pie',
        radius: ['55%', '100%'],
        center: ['50%', '80%'],
        // adjust the start and end angle
        startAngle: 180,
        endAngle: 360,
        data: [
          { value: 1048, name: 'Exitoso', itemStyle: { color: '#0DD987' } },
          { value: 735, name: 'Interrupción y reinicios', itemStyle: { color: '#FF8800' } },
          { value: 580, name: 'Error', itemStyle: { color: '#FF2929' } },
        ],
      },
    ],
  };
}
