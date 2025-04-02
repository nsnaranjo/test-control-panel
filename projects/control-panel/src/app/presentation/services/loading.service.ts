import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  // Variable que mantiene el estado de carga (true = mostrando spinner)
  private readonly _loading = new BehaviorSubject<boolean>(false);

  // Observable público para subscribirse a los cambios
  public readonly loading$: Observable<boolean> = this._loading.asObservable();

  show(): void {
    this._loading.next(true);
  }

  hide(): void {
    this._loading.next(false);
  }
}
