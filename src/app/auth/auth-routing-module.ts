import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';

const routes: Routes = [
  {
    path: 'signin',
    component: Login,
    data: {
      title: 'Sign-In'
    }
  },
  { path: '**', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
