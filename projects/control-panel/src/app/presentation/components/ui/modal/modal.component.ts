import { Component, EventEmitter, Output } from '@angular/core';
import { IconComponent } from 'ngx-spad-lib-icons';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  goBack(): void {
    this.closeModal.emit();
  }
}
