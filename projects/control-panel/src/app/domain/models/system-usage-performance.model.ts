export interface SystemUsagePerformanceModel {
  type: 'CPU' | 'STORAGE' | 'RAM' | 'VRAM';
  value: number;
  color: string;
  data: number[];
}
