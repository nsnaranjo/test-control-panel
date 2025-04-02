import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-service-controls',
  standalone: true,
  imports: [],
  templateUrl: './service-controls.component.html',
  styleUrl: './service-controls.component.scss',
})
export class ServiceControlsComponent {
  @Output() openModal: EventEmitter<boolean> = new EventEmitter();

  toggleOpen(): void {
    this.openModal.emit();
  }
}
