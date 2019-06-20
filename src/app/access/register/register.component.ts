import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};

  constructor(private userService: UserService,
              private router: Router) {
  }

  ngOnInit() {

  }

  submit(): any {
    this.userService.create(this.model)
      .subscribe((data) => {
        this.router.navigate(['/login'], {queryParams: {registered: true}});
      });
  }

}
