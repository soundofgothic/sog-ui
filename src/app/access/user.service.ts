import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Subject } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class UserService {
  token: string;
  userData: any = { logged: false };
  status: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient,
    private router: Router,
    @Inject(LOCAL_STORAGE) private local_storage: any) {
  }

  login(username: string, password: string) {
    return this.http.post('/user/auth', { email: username, password: password }).pipe(tap(response => {
      let user: any = response;
      if (user.user) {
        this.userData = user;
        this.userData.logged = true;
        this.status.next(this.userData);
        this.local_storage.setItem('currentUser', JSON.stringify(user));
      }
      return user;
    }));
  }

  create(user: any) {
    return this.http.post('/user/create', user);
  }

  async logged() {
    return false;
  }

  logout() {
    this.local_storage.removeItem('currentUser');
    this.userData = { logged: false };
    this.status.next(this.userData);
    this.router.navigate(['/login']);
  }

  registerOption() {
    return true;
  }

  getToken() {
    return JSON.parse(this.local_storage.getItem('currentUser')).token;
  }
}
