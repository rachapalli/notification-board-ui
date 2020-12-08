import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  isImage: boolean;
  imageSrc: any;
  urlSafe: SafeResourceUrl;
  notificationTypeSelect: any[];
  globalNotificationType: string;
  publicNotifications: CreateGroupModel[];
  constructor(private router: Router, private service: HttpServiceClient,private messageService: MessageService,  private sanitizer: DomSanitizer) {
        this.currentRoute = this.router.url;
        const routeArr =  this.router.url.split('/notification/getNotifications/');
        if(routeArr){
          this.groupName = routeArr[1];     
        }
}
  ngOnInit(): void {
    this.notificationTypeSelect = [{ label: 'All', value: null },{ label: 'Text', value: 'TEXT' },{ label: 'File', value: 'FILE' }];
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

  async fetchFiles(res: any){
    for(let i = 0; i < res.length; i++){
      let fileKeyObj = res[i];
      if(fileKeyObj.notification && fileKeyObj.notification.notificationType === 'FILE' && fileKeyObj.notification.file &&
      fileKeyObj.notification.file.fileKey){
          let response = null;
          const format = fileKeyObj.notification.file.fileKey.split('.');
          if(format){
            fileKeyObj.fileFormat = format[1].toLowerCase();
          }
            response = await this.service.getImageWithFileKey(fileKeyObj.notification.file.fileKey).catch( e => 
              console.log(e.message));
            console.log(fileKeyObj.notification.file.fileKey);
        this.createImageFromBlob(response, fileKeyObj);
        if(i === res.length - 1){
          this.publicNotifications = res;
        }
    }
    }
  }
  createImageFromBlob(image: Blob, fileObj: any) {
    if(!image) return;
    let reader = new FileReader();
    reader.onload = (e: any) => {
       let res = reader.result;
       
       if(fileObj.fileFormat === 'pdf'){
       let url = window.URL.createObjectURL(image);
       fileObj.notification.file.fileKey = image;// this.sanitizer.bypassSecurityTrustUrl(url);
       }else if(fileObj.fileFormat === 'excel'){
        // let url = window.URL.createObjectURL(image);
        // fileObj.notification.file.fileKey = this.sanitizer.bypassSecurityTrustUrl(url);
        } else if(res && res.toString().includes('data:application/octet-stream;base64')){
          fileObj.notification.file.fileKey = reader.result.toString().replace('data:application/octet-stream;base64', 'data:image/jpeg;base64');
         }
    };
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 onImageClick(event: any, format: string){
    console.log(event);
    // this.imageSrc = null;
    // this.urlSafe = null;
    this.isImage = true;
    if(format === 'pdf'){
      const blobTest =  new Blob([event], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(blobTest );
      this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    } else if(format === 'excel'){
      this.imageSrc = event;
    }else{
      this.imageSrc = event;
    }
   
 }
 fetchUserGroupNotifications(){
  this.publicNotifications = [new CreateGroupModel()];
    this.fetchNotifications();
 }

 onImageDialogClose(){
  this.imageSrc = null;
  this.urlSafe = null;
  this.isImage = false;
 }
}

