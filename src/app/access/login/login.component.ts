import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  model: any = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private us: UserService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  submit() {
    this.us.login(this.model.email, this.model.password)
      .subscribe(async data => {
        const params = await this.route.queryParams.pipe(first()).toPromise();
        if(params.returnUrl) {
          this.router.navigate([params.returnUrl]);
        } else {
          this.router.navigate(['/']);
        }
      });
  }

}
