import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { IconComponent } from 'ngx-spad-lib-icons';

import { InstanceService } from '../../../services/instance.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
  ],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  instanceName: string = '';
  isRunLog: boolean = false;

  private activeSubscription: Subscription = new Subscription();
  private routerSubscription: Subscription = new Subscription();

  private readonly instanceActive = inject(InstanceService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    // Subscription to instance name
    this.activeSubscription = this.instanceActive.activeName$.subscribe((name) => {
      this.instanceName = name;
    });

    // Validate current route
    this.checkCurrentRoute();

    // Subscription to route changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkCurrentRoute();
    });
  }

  ngOnDestroy(): void {
    // Cancel subscriptions to avoid memory leaks
    this.activeSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }

  /**
   * Validate current route and check if it is a runLog route
   */
  private checkCurrentRoute(): void {
    const currentUrl = this.router.url;

    this.isRunLog = currentUrl.includes('/run-log/');
  }

  goBack(): void {
    this.isRunLog ? this.router.navigate(['/service-history']) : this.router.navigate(['/instances']);
  }
}
