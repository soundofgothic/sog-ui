import {Inject, Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HTTP_INTERCEPTORS} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Observable, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {catchError, tap} from 'rxjs/operators';
import {LOCAL_STORAGE} from '@ng-toolkit/universal';


@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar,
              @Inject(LOCAL_STORAGE) private local_storage: any) {
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

    return next.handle(request).pipe(catchError(err => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          console.log('User not logged in');
        } else {
          if (err.error.msg) {
            this.snackBar.open(err.error.msg, ':c', {duration: 3000});
          } else {
            this.snackBar.open('Coś poszło nie tak', ':c', {duration: 3000});
          }
        }
        return throwError(err);
      }
    }));
  }

  getToken(): string {
    try {
      let currentUser = JSON.parse(this.local_storage.getItem('currentUser'));
      if (currentUser && currentUser.token) {
        return currentUser.token;
      } else {
        return '';
      }
    } catch (e) {

    }
    return '';
  }

}

export const interceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: Interceptor,
  multi: true
};
