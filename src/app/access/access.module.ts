import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AccessRoutingModule} from './access-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {UserService} from './user.service';
import {AuthGuard} from './auth.guard';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AccessRoutingModule,
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
  ],
  providers: [
    UserService,
    AuthGuard
  ]

})
export class AccessModule {
}
