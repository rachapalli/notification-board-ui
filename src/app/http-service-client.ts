import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { users } from './model/users.model';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceClient {

  constructor(private httpService: HttpClient) { }

  getGroups(): any{
    return this.httpService.get("http://localhost:8080/notification-board-0.0.1-SNAPSHOT/group/getGroups");
  }

  authenticateUserLogin(userName: any, password: any): any{
    return this.httpService.post("http://localhost:8080/notification-board-0.0.1-SNAPSHOT/user/authenticate", {"username": userName, password: password});
  }

  registerNewUser(userDetails: users): any{
    return this.httpService.post("http://localhost:8080/notification-board-0.0.1-SNAPSHOT/user/register", userDetails);
  }
  
  getOwnerGroups(user: string,isPublic: boolean): any{
      return this.httpService.post("http://localhost:8080/notification-board-0.0.1-SNAPSHOT/group/getOwnerGroups", {email: user});
    }
  
  getUserTypes(): any{
    return  this.httpService.get("http://localhost:8080/notification-board-0.0.1-SNAPSHOT/user/userTypes");
  }
}
