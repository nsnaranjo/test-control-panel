import { Component, inject, Input, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { IconComponent } from 'ngx-spad-lib-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-status-icon',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './status-icon.component.html',
  styleUrl: './status-icon.component.scss',
})
export class StatusIconComponent implements OnInit {
  @Input() type: 'success' | 'warning' | 'error' = 'success';
  @Input() advanced: string | null = null;
  @Input() label: string = '';

  iconClass: string = '';
  containerClass: string = '';

  protected router = inject(Router);

  ngOnInit() {
    this.setClasses();
  }

  private styleContainerClass(): string {
    this.containerClass = this.getContainerClass('status__icon', this.type);
    return this.containerClass;
  }

  private getContainerClass(baseClass: string, typePrefix: string): string {
    const statusClassMap: Record<string, string> = {
      disabled: `${baseClass}--disabled`,
      maintenance: `${baseClass}--maintenance`,
      failure: `${baseClass}--failure`,
    };

    return statusClassMap[this.advanced!] || `${baseClass}--${typePrefix}`;
  }

  private setClasses(): void {
    // Set container classes based on type and disabled state
    this.styleContainerClass();

    switch (this.type) {
      case 'success':
        this.iconClass = 'success';
        break;
      case 'warning':
        this.iconClass = 'pause';
        break;
      case 'error':
        this.iconClass = 'error';
        break;
    }
  }


  get isHomePage(): boolean {
    return this.router.url === '/';
  }
}
