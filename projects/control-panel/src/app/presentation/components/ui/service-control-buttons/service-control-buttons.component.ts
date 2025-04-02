// Lib
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

// Domain
import { ButtonType, ServiceControlButtonsInterface } from '@domain/interfaces';
import { IconComponent } from 'ngx-spad-lib-icons';

@Component({
  selector: 'app-service-control-buttons',
  standalone: true,
  imports: [
    NgClass,
    CommonModule,
    IconComponent,
  ],
  templateUrl: './service-control-buttons.component.html',
  styleUrl: './service-control-buttons.component.scss',
})
export class ServiceControlButtonsComponent implements OnInit {
  @Input() buttons: (ButtonType | ServiceControlButtonsInterface)[] = [];
  @Input() serviceData: any = null;

  @Input() set controlButtonStyle(value: boolean) {
    this._controlButtonStyle = value;
    this.controlButtonTrueClass = value;
    this.controlButtonFalseClass = !value;
  }

  get controlButtonStyle(): boolean {
    return this._controlButtonStyle;
  }

  @Input() set iconTemplates(templates: Record<ButtonType, any>) {
    if (templates) {
      this._iconTemplates = templates;

      if (this.processedButtons.length > 0) {
        this.processButtons();
      }
    }
  }

  get iconTemplates(): Record<ButtonType, any> {
    return this._iconTemplates;
  }

  private _controlButtonStyle: boolean = true;

  private _iconTemplates: Record<ButtonType, any> = {
    'start': null,
    'stop': null,
    'restart': null,
    'terminal': null,
    'runLog': null,
    'observation': null,
  };

  @HostBinding('class.control-button-true') controlButtonTrueClass: boolean = true;
  @HostBinding('class.control-button-false') controlButtonFalseClass: boolean = false;

  @Output() terminalClick = new EventEmitter<any>();
  @Output() runLogClick = new EventEmitter<any>();
  @Output() startClick = new EventEmitter<any>();
  @Output() stopClick = new EventEmitter<any>();
  @Output() restartClick = new EventEmitter<any>();
  @Output() observationClick = new EventEmitter<any>();

  processedButtons: ServiceControlButtonsInterface[] = [];

  private readonly buttonDefaults: Record<ButtonType, ServiceControlButtonsInterface> = {
    'start': {
      type: 'start',
      visible: true,
      tooltip: 'Iniciar',
    },
    'stop': {
      type: 'stop',
      visible: true,
      tooltip: 'Detener',
    },
    'restart': {
      type: 'restart',
      visible: true,
      tooltip: 'Reiniciar',
    },
    'terminal': {
      type: 'terminal',
      visible: true,
      tooltip: 'Abrir Terminal',
    },
    'runLog': {
      type: 'runLog',
      visible: true,
      tooltip: 'Detalles RunLog',
    },
    'observation': {
      type: 'observation',
      visible: true,
      tooltip: 'Detalle observación',
    },
  };

  ngOnInit() {
    this.processButtons();
  }

  isButtonDisabled(buttonType: string): boolean {
    if (!this.serviceData?.status) return false;

    const status = this.serviceData.status;

    switch (buttonType) {
      case 'start':
        return status === 'success' || status === 'warning';
      case 'restart':
        return status === 'warning';
      case 'stop':
        return status === 'error';
      default:
        return false;
    }
  }

  getButtonClass(buttonType: string): string {
    const isDisabled = this.isButtonDisabled(buttonType);

    if (isDisabled) {
      return 'control-actions__icon--disabled';
    }

    switch (buttonType) {
      case 'start':
      case 'restart':
      case 'stop':
        return 'control-actions__icon--active';
      case 'terminal':
        return 'control-actions__icon--terminal';
      case 'runLog':
        return 'control-actions__icon--runlog';
      case 'observation':
        return 'control-actions__icon--observation';
      default:
        return 'control-actions__icon--active';
    }
  }

  private processButtons() {
    this.processedButtons = this.buttons.map((button: ButtonType | ServiceControlButtonsInterface) => {
      if (typeof button === 'string') {
        const buttonType: ButtonType = button;
        const processedButton = { ...this.buttonDefaults[buttonType] };

        // Asignar el template si existe
        if (this._iconTemplates[buttonType]) {
          processedButton.svgTemplate = this._iconTemplates[buttonType];
        }

        return processedButton;
      } else {
        const buttonConfig: ServiceControlButtonsInterface = button;
        const defaults: ServiceControlButtonsInterface = this.buttonDefaults[buttonConfig.type];
        const processedButton = { ...defaults, ...buttonConfig };

        // Respetar el template personalizado si existe en la configuración
        if (!processedButton.svgTemplate && this._iconTemplates[buttonConfig.type]) {
          processedButton.svgTemplate = this._iconTemplates[buttonConfig.type];
        }

        return processedButton;
      }
    });
  }

  handleButtonClick(button: ServiceControlButtonsInterface, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (button.type === 'start') {
      this.startClick.emit(this.serviceData);
    } else if (button.type === 'stop') {
      this.stopClick.emit(this.serviceData);
    } else if (button.type === 'restart') {
      this.restartClick.emit(this.serviceData);
    } else if (button.type === 'terminal') {
      this.terminalClick.emit(this.serviceData);
    } else if (button.type === 'runLog') {
      this.runLogClick.emit(this.serviceData);
    } else if (button.type === 'observation') {
      this.observationClick.emit(this.serviceData);
    }
  }

  getTooltipText(button: ServiceControlButtonsInterface): string {
    return button.tooltip ?? '';
  }
}
