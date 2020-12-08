import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
import { CreateGroupModel, GroupNotificationModel, Groups } from './model/group.model';
import { BoardInvitation } from './model/invitation.model';
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

  createBoard(req: Groups): any {
    if(req && req.groupId){
      return this.updateBoard(req);
    }else {
      return this.httpService.post(environment.apiUrl + "/group/create", req);
    }
  }

  updateBoard(req: Groups): any {
    return this.httpService.post(environment.apiUrl + "/group/update", req);
  }

  deleteBoard(req: Groups){
    return this.httpService.post(environment.apiUrl + "/group/delete", req);
  }
  

  createorUpdateNotification(req: CreateGroupModel): any{
    if(req && req.notification.notificationId){
     return this.updateNotification(req.notification);
    }else{
      return this.createNotification(req);
    }
  }
  createNotification(data: CreateGroupModel): any {
    return this.httpService.post(environment.apiUrl + "/notification/create", data);
  }

  updateNotification(data: GroupNotificationModel): any {
    return this.httpService.post(environment.apiUrl + "/notification/update", data);
  }

  deleteNotification(data: CreateGroupModel): any {
    return this.httpService.post(environment.apiUrl + "/notification/delete", data);
  }

  

  getUserGRoupNotifications(email: string, groupName: string): any {
    // if(groupName){
    //   return this.getNotifications(groupName);
    // }else{
    return this.getUserGRoupNotificationByEmail(email);
    // }
  }

  getUserGRoupNotificationByEmail(email: string): any {
    return this.httpService.post(environment.apiUrl + "/notification/getUserGroupNotifications", { email: email });
  }
  getNotifications(groupName: string): any{
    return this.httpService.get(environment.apiUrl + "/notification/getNotifications/"+ groupName);
  }
 
  getImageWithFileKey(fileKey: string): any{
    return this.httpService.get(environment.apiUrl + "/file/download?file="+fileKey, { responseType: 'blob' }).toPromise();

  }

  getUserDetailsWithEmail(email: any): any{
    return this.httpService.get(environment.apiUrl + "/user/"+email);
  }

  uploadFile(file: any): any {
    return this.httpService.post(environment.apiUrl + "/file/upload", file);
  }

  getAllInvitations(): any{
    return this.httpService.get(environment.apiUrl + "/invitation/list");
  }

  sendInvitation(req: BoardInvitation){
    return this.httpService.post(environment.apiUrl + "/invitation/sendBoardInvitation", req);
  }
}
