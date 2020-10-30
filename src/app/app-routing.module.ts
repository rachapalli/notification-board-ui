import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardmemberComponent } from './boardmember/boardmember.component';
import { HeaderComponent } from './layouts/header/header.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: 'boardMember', component: BoardmemberComponent
  },
  {
    path: '**', redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
