import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpServiceClient } from '../http-service-client';
import { CreateGroupModel, GroupNotificationModel } from '../model/group.model';

@Component({
  selector: 'app-notification-by-group-name',
  templateUrl: './notification-by-group-name.component.html',
  styleUrls: ['./notification-by-group-name.component.css']
})
export class NotificationByGroupNameComponent implements OnInit {
  currentRoute: string;
  groupName: string;
  imageToShow: any;
  notificationTypeSelect: any[];
  globalNotificationType: string;
  publicNotifications: CreateGroupModel[];
  constructor(private router: Router, private service: HttpServiceClient,private messageService: MessageService) {
        this.currentRoute = this.router.url;
        const routeArr =  this.router.url.split('/notification/getNotifications/');
        if(routeArr){
          this.groupName = routeArr[1];     
        }
}
  ngOnInit(): void {
    this.notificationTypeSelect = [{ label: 'Select Notificatoin Type', value: null },{ label: 'Text', value: 'TEXT' },{ label: 'File', value: 'FILE' }];
   this.fetchNotifications();
  }
  fetchNotifications(){
    this.service.getNotifications(this.groupName).subscribe( res => {
      if(res){
        if(this.globalNotificationType === 'TEXT'){
          this.publicNotifications = res.filter(r1 => r1.notification.notificationType === 'TEXT');
        }else if(this.globalNotificationType === 'FILE'){
          this.fetchFiles( res.filter(r1 => r1.notification.notificationType === 'FILE'));
      }else{
        this.fetchFiles(res);
      }
      }
    }, () => {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Error Occured While Fetching details with ' + this.groupName});
    });
  }

  fetchFiles(res: any){
    for(const fileKeyObj of res){
      if(fileKeyObj.notification && fileKeyObj.notification.notificationType === 'FILE' && fileKeyObj.notification.file &&
      fileKeyObj.notification.file.fileKey){
      this.service.getImageWithFileKey(fileKeyObj.notification.file.fileKey).subscribe((imgRes)=>{
        this.createImageFromBlob(imgRes, fileKeyObj);
        fileKeyObj.notification.file.fileKey = imgRes;
        this.publicNotifications = res;
      }, err => {
        console.log('Image Fetching Error' + err);
        this.publicNotifications = res;
      });
    }
    }
  }
  createImageFromBlob(image: Blob, fileObj: any) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       let res = reader.result;
       if(res && res.toString().includes('data:application/octet-stream;base64')){
        fileObj.notification.file.fileKey = reader.result.toString().replace('data:application/octet-stream;base64', 'data:image/jpeg;base64');
       }
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 fetchUserGroupNotifications(){
    this.fetchNotifications();
 }
}

