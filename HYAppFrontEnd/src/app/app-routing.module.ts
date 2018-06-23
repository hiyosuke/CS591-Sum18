// credits for code goes to techiediaries @ https://www.techiediaries.com/angular-tutorial/
// credit for any routing related code in this angular cli directory goes to this individual/group above

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UberLoginComponent} from './uber-login/uber-login.component';

const routes: Routes = [
  { path: '', redirectTo: 'http://localhost:3000/uber/v1.2/login', pathMatch: 'full' },
  {
    path: '/uber/v1.2/login',
    component: UberLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
