import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { CreateGroupModel, Groups } from './model/group.model';
import { Users } from './model/users.model';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceClient {
  url = 'https://notification-demo-app.azurewebsites.net';
  constructor(private httpService: HttpClient) { }

  getGroups(): any {
    return this.httpService.get(this.url + "/group/getGroups");
  }

  authenticateUserLogin(userName: any, password: any): any {
    return this.httpService.post(this.url + "/user/authenticate", { "username": userName, password: password });
  }

  registerNewUser(userDetails: Users): any {
    return this.httpService.post(this.url + "/user/register", userDetails);
  }

  getOwnerGroups(user: string, isPublic: boolean): any {
    return this.httpService.post(this.url + "/group/getOwnerGroups", { email: user });
  }

  getUserTypes(): any {
    return this.httpService.get(this.url + "/user/userTypes");
  }

  createGroup(req: Groups): any {
    return this.httpService.post(this.url + "/group/create", req);
  }

  createNotification(data: CreateGroupModel): any {
    return this.httpService.post(this.url + "/notification/create", data);
  }

  getUserGRoupNotifications(email: string): any {
    return this.httpService.post(this.url + "/notification/getUserGroupNotifications", { email: email });
  }
  getNotifications(groupName: string): any{
    return this.httpService.get(this.url + "/notification/getNotifications/"+ groupName);
  }
 
  getImageWithFileKey(fileKey: string): any{
    return this.httpService.get(this.url + "/file/download?file="+fileKey);

  }
}
