import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JsonDataService<T> {
  private readonly httpClient = inject(HttpClient);

  /**
   * A service to fetch JSON data from a specified URL.
   *
   * @template T - The type of the data expected from the HTTP response.
   */
  getData(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }

}
