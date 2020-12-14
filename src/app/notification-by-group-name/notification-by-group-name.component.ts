import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { CreateGroupModel, GroupNotificationModel } from '../model/group.model';

@Component({
  selector: 'app-notification-by-group-name',
  templateUrl: './notification-by-group-name.component.html',
  styleUrls: ['./notification-by-group-name.component.css']
})
export class NotificationByGroupNameComponent implements OnInit {
  routerRef: any;
  groupName: string;
  imageToShow: any;
  isImage: boolean;
  imageSrc: any;
  urlSafe: SafeResourceUrl;
  excelUrlSafe: SafeResourceUrl;
  notificationTypeSelect: any[];
  globalNotificationType: string;
  publicNotifications: CreateGroupModel[];
  notificationLabel = 'Select Notification Type:';
  constructor(private router: Router,private route: ActivatedRoute, public authService: AuthenticationService, private service: HttpServiceClient,private messageService: MessageService,  private sanitizer: DomSanitizer) {
        
          this.routerRef =  this.route.queryParams.subscribe(params => {
            this.groupName = params['groupName'];
        });  
}
  ngOnInit(): void {
    this.notificationTypeSelect = [{ label: 'All', value: null },{ label: 'Text', value: 'TEXT' },{ label: 'File', value: 'FILE' }];
    this.fetchNotifications();
  }
  fetchNotifications(){
    this.publicNotifications = [];
    // if(!this.groupName) this.router.navigate(['/login']);
    this.service.getNotifications(this.groupName).subscribe( res => {
      if(res){
        if(this.globalNotificationType === 'TEXT'){
          this.publicNotifications = res.filter(r1 => r1.notification.notificationType === 'TEXT');
        }else if(this.globalNotificationType === 'FILE'){
          this.fetchFiles( res.filter(r1 => r1.notification.notificationType === 'FILE'));
      }else{
        // this.publicNotifications = res.filter(r1 => r1.notification.notificationType === 'TEXT');
        this.fetchFiles(res);
      }
      }
    }, err => {
      if(err && err.status === 401){
        this.messageService.add({severity:'error', summary:'Error', detail: 'Please login to get details of ' + this.groupName + ' board.'});
      }else{
      this.messageService.add({severity:'error', summary:'Error', detail: 'Error Occured While Fetching details with ' + this.groupName});
      }
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
          if (fileKeyObj.fileFormat !== 'pdf' && fileKeyObj.fileFormat !== 'xlsx') {
            response = await this.service.getImageWithFileKey(fileKeyObj.notification.file.fileKey).catch(e =>
              console.log(e.message));
            this.createImageFromBlob(response, fileKeyObj);
          }
        if(i === res.length - 1){
          this.publicNotifications = [...this.publicNotifications, ...res];
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
           fileObj.notification.file.fileKey = image;// this.sanitizer.bypassSecurityTrustUrl(url);
       }else if(fileObj.fileFormat === 'xlsx'){
           fileObj.notification.file.fileKey = image;
        } else if(res && res.toString().includes('data:application/octet-stream;base64')){
          fileObj.notification.file.fileKey = reader.result.toString().replace('data:application/octet-stream;base64', 'data:image/jpeg;base64');
         }
    };
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

 onImageClick(event: any, format: string) {
  let createdFile = null;
  if (event.length > 1000 || event.size > 1000) {
    this.imageSrc = event;
    this.isImage = true;
    return;
  }
  if(format !== 'pdf' && format !== 'xlsx'){
    this.messageService.add({ severity: 'warn',  detail: 'No Image Found' });
    return;
  }
  
  let reader = new FileReader();
  this.service.getImageWithFileKeyObserver(event).subscribe(response => {
    // this.createImageFromBlob(response, createdFile);

    reader.onload = (e: any) => {
        if (format === 'pdf') {
        let result = reader.result;
        result = result.toString().replace('application/octet-stream', 'application/pdf');
        this.isImage = true;
          this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(result.toString());
      }
      else if (format === 'xlsx') {
        this.isImage = true;
        let result = reader.result;
        result = result.toString().replace('application/octet-stream', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          this.excelUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(result.toString());
          setTimeout(() => {
            this.isImage = false;
          },1);
      };
    }
    if (response) {
      reader.readAsDataURL(response);
    }
  }, err => {
    this.messageService.add({ severity: 'warn',  detail: 'No File Found' });
  });
}

 fetchUserGroupNotifications(){
  this.publicNotifications = [new CreateGroupModel()];
    this.fetchNotifications();
 }

 onImageDialogClose(){
  this.imageSrc = null;
  this.urlSafe = null;
  this.excelUrlSafe = null;
  this.isImage = false;
 }
}

