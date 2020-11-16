import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
import { CreateGroupModel, Groups } from './model/group.model';
import { Users } from './model/users.model';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceClient {
  constructor(private httpService: HttpClient, public loaderService: LoaderService) { 
    
  }
  token: string;

  
  getGroups(): any {
    return this.httpService.get(environment.apiUrl + "/group/getGroups");
  }

  authenticateUserLogin(userName: any, password: any): any {
    return this.httpService.post(environment.apiUrl + "/user/authenticate", { "username": userName, password: password });
  }

  registerNewUser(userDetails: Users): any {
    return this.httpService.post(environment.apiUrl + "/user/register", userDetails);
  }

  getOwnerGroups(user: string): any {
    return this.httpService.post(environment.apiUrl + "/group/getOwnerGroups", { email: user });
  }

  getUserTypes(): any {
    return this.httpService.get(environment.apiUrl + "/user/userTypes");
  }

  createGroup(req: Groups): any {
    return this.httpService.post(environment.apiUrl + "/group/create", req);
  }

  createNotification(data: CreateGroupModel): any {
    return this.httpService.post(environment.apiUrl + "/notification/create", data);
  }

  getUserGRoupNotifications(email: string): any {
    return this.httpService.post(environment.apiUrl + "/notification/getUserGroupNotifications", { email: email });
  }
  getNotifications(groupName: string): any{
    return this.httpService.get(environment.apiUrl + "/notification/getNotifications/"+ groupName);
  }
 
  getImageWithFileKey(fileKey: string): any{
    return this.httpService.get(environment.apiUrl + "/file/download?file="+fileKey);

  }

  getUserDetailsWithEmail(email: any): any{
    return this.httpService.get(environment.apiUrl + "/user/"+email);
  }
}
