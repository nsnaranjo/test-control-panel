import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { IBaseInstancesModel, IOrderStatus, IStatusInstances, PaginationConfig } from '@domain/models';
import { JsonDataService } from '@infrastructure/helpers/json-data.service';
import { InstanceCardComponent } from '@components/ui/instance-card/instance-card.component';
import { InstanceService } from '@presentation/services/instance.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, InstanceCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {
  // Data Interface
  MOCK_INSTANCE_DATA: IBaseInstancesModel[] = [];

  // Initialization of the pagination interface
  indicators: PaginationConfig = { itemsPerPage: 0, currentPage: 0, totalItems: 0 };

  // Instance Per Status Interface
  instancePerStatus: IStatusInstances = {};

  // Suscription
  private jsonSubscription: Subscription = new Subscription();

  // Data Services
  private readonly jsonService = inject(JsonDataService<IBaseInstancesModel[]>);

  private readonly instance = inject(InstanceService);


  /**
   * Subscription to the service to retrieve instance data.
   * - Stores data in MOCK_INSTANCE_DATA.
   * - Groups instances by status and stores them in instancePerStatus.
   * - Updates the total number of items in the indicators and calculates
   *   the number of elements per page based on the screen size.
   */
  ngOnInit(): void {
    this.jsonSubscription = this.jsonService.getData('assets/data/instances.json').subscribe((data) => {
      this.MOCK_INSTANCE_DATA = data;
      this.instancePerStatus = this.groupByStatus(data);
      this.instance.updateInstances(data);
    });
    this.calculateItemsPerPage(window.innerWidth, window.innerHeight);
  }

  ngOnDestroy(): void {
    this.jsonSubscription.unsubscribe();
  }


  /**
   * Groups a list of instances by their state.
   *
   * @param instances - List of instances to group.
   * @returns An object where the keys are the states and the values ​​are lists of instances with that state.
   */
  groupByStatus(instances: IBaseInstancesModel[]): IStatusInstances {
    return instances.reduce((accumulator: IStatusInstances, instance: IBaseInstancesModel) => {
      const { status } = instance;

      if (!accumulator[status]) {
        accumulator[status] = [];
      }

      accumulator[instance.status].push(instance);

      return accumulator;
    }, {} as IStatusInstances);
  }

  /**
   * Sorts states based on a predefined order.
   *
   * @param a - First object with a state key.
   * @param b - Second object with a state key.
   * @returns A negative number if `a` must appear before `b`,
   * a positive number if `b` must appear before `a`,
   * or 0 if they are equal.
   */
  statusOrder = (a: { key: string }, b: { key: string }): number => {
    const order: IOrderStatus[] = ['fallo', 'atención', 'mantenimiento', 'en ejecución', 'deshabilitado'];
    return order.indexOf(a.key as IOrderStatus) - order.indexOf(b.key as IOrderStatus);
  };

  /**
   * Handles window resize events and updates the number of items per page
   * based on the new screen width.
   * @param event The window resize event.
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    const target = event.target as Window;
    this.calculateItemsPerPage(target.innerWidth, target.innerHeight);
  }

  /**
   * Adjusts the number of items displayed per page based on the window width.
   * This method dynamically updates `itemsPerPage` to optimize content display
   * for different screen sizes.
   *
   * @param width - The current width of the window.
   */
  calculateItemsPerPage(width: number, height: number): void {
    let itemsPerPage: number;

    if (width <= 400) {
      itemsPerPage = 1;
    } else if (width <= 720) {
      itemsPerPage = 3;
    } else if (width <= 1524) {
      itemsPerPage = 4;
    } else if (width <= 1980) {
      itemsPerPage = 9;
    } else {
      itemsPerPage = 12;
    }


    this.indicators = { ...this.indicators, itemsPerPage };
  }

  /**
   * Getter to retrieve the current paged instances grouped by status.
   * Groups all instances by status using `groupByStatus` and sorts by `statusOrder` to return * a single list of instances.
   *
   * @returns An object containing the instances grouped by status, corresponding to the current page.
   */
  currentInstances() {
    const instancesByStatus = this.groupByStatus(this.MOCK_INSTANCE_DATA);

    if (!this.indicators) return instancesByStatus;

    const sortedInstances = Object.entries(instancesByStatus)
      .map(([key, value]) => ({ key, instances: value }))
      .sort(this.statusOrder)
      .flatMap(({ instances }) => instances);

    this.indicators = { ...this.indicators, totalItems: sortedInstances.length };

    const { currentPage, itemsPerPage } = this.indicators;

    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedInstances = sortedInstances.slice(start, end);

    return this.groupByStatus(paginatedInstances);
  }

  /**
   * Gets an array with the page range based on total items and items per page.
   * Used to generate pagination indicators.
   *
   * @returns Total indicators to access all instances
   */
  get pagesRange(): number[] {
    const totalPages = Math.ceil(this.indicators.totalItems / this.indicators.itemsPerPage);

    return this.indicators ? Array.from({ length: totalPages }, (_, i) => i) : [];
  }

  /**
   * Updates the current slide based on the selected indicator.
   * @param page - The index of the slide to navigate to.
   */
  setInstance(page: number): void {
    if (this.indicators?.currentPage !== undefined) this.indicators.currentPage = page;
  }

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const bottomReached = target.scrollTop + target.clientHeight >= target.scrollHeight;
    const topReached = target.scrollTop === 0;

    console.log(bottomReached);
    console.log(topReached);


    if (bottomReached && this.indicators.currentPage < this.indicators.totalItems - 1) {
      this.indicators.currentPage++;
      this.currentInstances();
      this.resetScroll(); // Resetea scroll después de cambiar la página
    } else if (topReached && this.indicators.currentPage > 0) {
      this.indicators.currentPage--;
      this.currentInstances();
      this.resetScroll(true); // Resetea scroll al fondo si es necesario
    }
  }

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  resetScroll(toBottom = false) {
    setTimeout(() => {
      if (this.scrollContainer) {
        const container = this.scrollContainer.nativeElement;
        container.scrollTop = toBottom ? container.scrollHeight : 0;
      }
    }, 100);
  }
}
