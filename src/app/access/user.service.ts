import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {WINDOW, NGT_DOCUMENT, LOCAL_STORAGE} from '@ng-toolkit/universal';
import {tap} from 'rxjs/operators';
import {Subject} from 'rxjs';


@Injectable()
export class UserService {
  token: string;
  userData: any = {logged: false};
  status: Subject<any> = new Subject<any>();

  constructor(private http: HttpClient,
              private router: Router,
              @Inject(LOCAL_STORAGE) private local_storage: any,) {
  }

  login(username: string, password: string) {
    return this.http.post('/user/auth', {email: username, password: password}).pipe(tap(response => {
      let user = response;
      if (user) {
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
    if (this.userData.logged) {
      return true;
    } else {
      try {
        let response: any = await this.http.post('/user/logged', {}).toPromise();
        if (response.logged) {
          this.userData = JSON.parse(localStorage.getItem('currentUser'));
          this.userData.logged = true;
          this.status.next(this.userData);
          return true;
        } else {
          return false;
        }
      } catch (e) {
        console.log(e);
        return false;
      }

    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.userData = {logged: false};
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
