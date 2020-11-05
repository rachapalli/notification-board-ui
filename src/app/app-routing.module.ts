import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardmemberComponent } from './boardmember/boardmember.component';
import { HeaderComponent } from './layouts/header/header.component';
import { LoginComponent } from './login/login.component';
import { NotificationByGroupNameComponent } from './notification-by-group-name/notification-by-group-name.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {
    path: 'boardMember', component: BoardmemberComponent
  },
  { path: 'notification/getNotifications',  component: NotificationByGroupNameComponent,
  children: [
    { path: '**', component: NotificationByGroupNameComponent}
  ]
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
