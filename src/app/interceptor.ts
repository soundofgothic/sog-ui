import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable} from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.getToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.getToken()}`
        },
        url: environment.apiUrl + request.url
      });
    } else {
      request = request.clone({
        url: environment.apiUrl + request.url
      });
    }

    return next.handle(request);
  }

  getToken(): string {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.token) {
      return currentUser.token;
    } else {
      return '';
    }
  }

}

export const interceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
};
