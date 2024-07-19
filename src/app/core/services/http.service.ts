import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface GetRequestOptions {
  baseUrl: string;
  routes?: string[];
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(opts: GetRequestOptions): Observable<T> {
    let requestUrl = opts.baseUrl;
    if (opts.routes) {
      requestUrl = requestUrl.concat(...opts.routes);
    }
    const _headers = new HttpHeaders(opts.headers);
    const _params = new HttpParams(opts.params);
    return this.http.get<T>(requestUrl, {
      headers: _headers,
      params: _params,
      responseType: 'json',
    });
  }
}
