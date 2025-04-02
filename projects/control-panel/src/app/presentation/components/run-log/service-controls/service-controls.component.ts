import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { StatusIconComponent } from '@components/ui/status-icon/status-icon.component';
import {
  ServiceControlButtonsComponent
} from '@components/ui/service-control-buttons/service-control-buttons.component';
import { ButtonType } from '@domain/interfaces';
import { IconComponent } from 'ngx-spad-lib-icons';

@Component({
  selector: 'app-service-controls',
  standalone: true,
  imports: [
    StatusIconComponent,
    ServiceControlButtonsComponent,
    IconComponent,
  ],
  templateUrl: './service-controls.component.html',
  styleUrl: './service-controls.component.scss'
})
export class ServiceControlsComponent implements AfterViewInit {
  @ViewChild('restartIcon') restartIcon!: TemplateRef<any>
  @ViewChild('startIcon') startIcon!: TemplateRef<any>
  @ViewChild('stopIcon') stopIcon!: TemplateRef<any>
  @ViewChild('terminalIcon') terminalIcon!: TemplateRef<any>

  iconTemplates: Record<ButtonType, TemplateRef<any>> | any = {}

  ngAfterViewInit(): void {
      this.iconTemplates = {
        'restart': this.restartIcon,
        'start': this.startIcon,
        'stop': this.stopIcon,
        'terminal': this.terminalIcon
      }
  }

  restartService() {
    alert(`Reiniciando servicio`);
  }

  startService() {
    alert(`Iniciando servicio`);
  }

  stopService() {
    alert(`Deteniendo servicio`);
  }

  openTerminal() {
    alert(`Abrir Terminal`);
  }

}
