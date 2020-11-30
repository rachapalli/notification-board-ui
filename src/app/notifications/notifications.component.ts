import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { CreateGroupModel, File, GroupNotificationModel, MessageCls } from '../model/group.model';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  globalNotificationType = null;
  display: boolean = false;
  filedetails: any;
  isButtonDisabled = true;
  isPublic = true;
  isPublicSelect = true;
  isCreateError = false;
  errorMessage = '';
  groupTypes: SelectItem[];
  groupsData: SelectItem[];
  totalGroups: any[];
  notificationTypeOpt: any[];
  notificationTypeSelect: any[];
  mainGroupModel = new CreateGroupModel();
  groupModel = new CreateGroupModel();
  publicNotifications: CreateGroupModel[];
  privateNotifications: CreateGroupModel[];
  publicGroups: any;
  privateGroups: any;
  userId: any;
  isImage = false;
  imageSrc: any;
  notificationId: number;
  uploadFileVal: FormData;
  
  constructor(private httpService: HttpServiceClient,public authService: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchGroups();
    this.groupModel.notification.notificationType = 'TEXT';
    this.globalNotificationType = null;
    this.groupModel.notification.message = new MessageCls();
    this.notificationTypeOpt = [{ label: 'Text', value: 'TEXT' },{ label: 'File', value: 'FILE' }];
    this.notificationTypeSelect = [{ label: 'Select Notificatoin Type', value: null },{ label: 'Text', value: 'TEXT' },{ label: 'File', value: 'FILE' }];
  }

  fetchGroups() {
    if (!this.authService.currentUserValue) return;
    this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
      if (res) {
        this.totalGroups = [{ label: 'All', value: null }];
        for (const groupData of res) {
          this.totalGroups.push({ label: groupData.groupName, value: groupData.groupId, ref: groupData.isPublic });
        }
        this.publicGroups = this.totalGroups.filter(t => t.ref);
        this.privateGroups = this.totalGroups.filter(t => !t.ref);
        this.fetchUserGroupNotifications();
      }
    }, error => {
      console.log(error);
    });

  }
  filterNotifications(){
    if(this.globalNotificationType === 'TEXT'){
      this.privateNotifications = this.privateNotifications.filter(r1 => r1.notification.notificationType === 'TEXT');
      this.publicNotifications = this.publicNotifications.filter(r1 => r1.notification.notificationType === 'TEXT');
    }else if(this.globalNotificationType === 'FILE'){
      this.privateNotifications = this.privateNotifications.filter(r1 => r1.notification.notificationType === 'FILE');
      this.publicNotifications = this.publicNotifications.filter(r1 => r1.notification.notificationType === 'FILE');
    }
  }
  onGroupSelect(event: any) {
    if (!event.value) {
      this.fetchUserGroupNotifications();
      return;
    }
    let groupName = null;
    if(this.totalGroups && this.mainGroupModel.groupId){
      const group = this.totalGroups.filter(t => t.value === this.mainGroupModel.groupId);
      groupName = group[0].label;
    }
    this.httpService.getUserGRoupNotifications(this.authService.currentUserValue.results.username, groupName).subscribe((res) => {
      if (res) {
        let isPublicRef = null;
        if (this.totalGroups && event.value) {
          const refRes = this.totalGroups.filter(s => s.value === event.value)
          if (refRes) {
            isPublicRef = refRes[0].ref;
          }
        }
        if (isPublicRef) {
          this.privateNotifications = [];
          this.isPublicSelect = true;
          this.publicNotifications = res.filter(s => s.groupId === event.value);
        } else {
          this.isPublicSelect = false;
          this.publicNotifications = [];
          this.privateNotifications = res.filter(s => s.groupId === event.value);
        }
        this.filterNotifications();
      }
    }, error => {
      console.log(error);
    });
  }
  fetchUserGroupNotifications() {
    let groupName = null;
    if(this.totalGroups && this.mainGroupModel.groupId){
      const group = this.totalGroups.filter(t => t.value === this.mainGroupModel.groupId);
      groupName = group[0].label;
    }
    this.httpService.getUserGRoupNotifications(this.authService.currentUserValue.results.username, groupName).subscribe((res) => {
      if (res) {
        this.isPublicSelect = true;
        this.publicNotifications = res.filter(r1 => this.publicGroups.some(r2 => r1.groupId === r2.value));
        this.privateNotifications = res.filter(r1 => this.privateGroups.some(r2 => r1.groupId === r2.value));
        if(this.mainGroupModel.groupId){
          this.publicNotifications = this.publicNotifications.filter(s => s.groupId === this.mainGroupModel.groupId);
          this.privateNotifications = this.privateNotifications.filter(s => s.groupId === this.mainGroupModel.groupId);
        }
        if(this.publicNotifications && this.publicNotifications.length === 0 && this.privateNotifications && this.privateNotifications.length > 0){
          this.isPublicSelect = false;
        }
        this.filterNotifications();
      }
    }, error => {
      console.log(error);
    });

  }
  showAddNotifyDialog() {
    this.display = true;
    this.groupTypes = [{ label: 'Public', value: true }];// , { label: 'Private', value: false }
    this.onGroupTypeSelect({ value: true });
    this.enableorDisableSubmit();
  }
  uploadFile(){
    this.httpService.uploadFile(this.uploadFileVal).subscribe((res) =>{
      this.groupModel.notification.file.name = res.name;
      this.groupModel.notification.file.fileId  = res.fileId;
      this.saveNotification();
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while uploading file.'});
    });
  }

  addNotification(){
    if(this.groupModel.notification.notificationType === 'FILE'){
      this.groupModel.notification.message = null;
      this.uploadFile();
    } else{
      this.groupModel.notification.file = null;
      this.saveNotification();
    }
  }
  saveNotification() {
    this.enableorDisableSubmit();
    let message = '';
    if(this.authService.currentUserValue){
    this.groupModel.createdBy = this.authService.currentUserValue.results.id;
    }
    if(this.notificationId !== 0){
      this.groupModel.notificationId = this.notificationId;
      message  = 'Notification details updated successfully';
    }else{
      message  = 'Notification added successfully';
    }
    this.httpService.createorUpdateNotification(this.groupModel).subscribe((res) => {
      this.onDialogClose(true);
      this.messageService.add({severity:'success', summary: 'Success', detail: message});
    }, err => {
      let errMessage = '';
      let error = '';
      if(err.error && err.error.message ){
        error = err.error.message;
       if(err.error.details && err.error.details[0]){
        errMessage =  err.error.details[0];
        this.messageService.add({severity:'error', summary: error, detail: errMessage});
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail: error});
      }
    } else {
      if(this.notificationId !== 0){
        errMessage = 'Error occured while updating notification details.';
      } else {
        errMessage = 'Error occured while adding notification';
      }
      this.messageService.add({severity:'error', summary: 'Error', detail: errMessage});
    }
   
      this.isCreateError = true;
    });
  }

  textChanged(event: any) {
    this.groupModel.message = event;
    this.enableorDisableSubmit();
  }
  onFileUpload(event: any) {
    this.filedetails = event.files.length;
    this.enableorDisableSubmit();
    const fileList: FileList = event.files;
        if (fileList.length > 0) {
            const file = fileList[0];
            this.uploadFileVal = new FormData();
            this.uploadFileVal.append('file', file, file.name);
        }

  }

  onFileRmoved() {
    this.filedetails = 0;
    this.enableorDisableSubmit();
  }

  onImageClick(event: any){
    this.isImage = true;
    this.imageSrc = event;
  }

  onImageDialogClose(){
    this.isImage = false;
    this.imageSrc = null;
  }
  onGroupTypeSelect(event: any) {
    if (this.authService.currentUserValue) {
      this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
        if (res) {
          this.groupsData = [{ label: 'Select Board', value: null }];
          for (const groupData of res.filter(s => s.isPublic === event.value)) {
            this.groupsData.push({ label: groupData.groupName, value: groupData.groupId });
          }
        }
      }, error => {
        console.log(error);
      });
    }
  }

  enableorDisableSubmit() {
    if (((this.groupModel.notification.message && this.groupModel.notification.message.message && this.groupModel.notification.message.message != '') || (this.filedetails && this.filedetails != 0)) && this.groupModel.groupId) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }
  onDialogClose(isData: boolean) {
    this.display = false;
    this.groupModel = new CreateGroupModel();
    this.groupModel.notification.notificationType = 'TEXT';
    this.groupTypes = [];
    this.isCreateError = false;
    this.errorMessage = '';
    this.isPublic = true;
    if(isData)
    this.fetchGroups();
    this.notificationId = 0;
  }

  onEditRow(event: any) {
    this.groupModel = new CreateGroupModel();
    let req = new GroupNotificationModel();
    req.notificationType = event.notification.notificationType;
    req.notificationId = event.notification.notificationId;
    req.description = event.notification.description;
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    
    
    this.isPublic = this.publicGroups.some(group => group.value === event.groupId);
    if(this.isPublic){
      this.groupsData = this.publicGroups;
    } else{
      this.groupsData = this.privateGroups;
    }
    this.groupModel.groupId = event.groupId;
    this.display = true;
    this.notificationId = event.notificationId;
    if(event.notification.message){
      req.message.message = event.notification.message.message;
    req.message.messageId = event.notification.message.messageId;
    }
    if(event.notification.file){
      req.file.fileId = event.notification.file.fileId;
    req.file.fileKey= event.notification.file.fileKey;
    }
    this.groupModel.notification = req;
    this.enableorDisableSubmit();
  }

  onDeleteRow(event: any) {
    if(!event.isActive)return;
    let req = new CreateGroupModel();
    req.groupId = event.groupId;
    req.notificationId = event.notification.notificationId;
    req.updatedBy = event.notification.updatedBy;
    this.httpService.deleteNotification(req).subscribe(res =>{
      this.messageService.add({severity:'success', summary: 'Success', detail: res.message});
      this.fetchUserGroupNotifications();
    },err => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Error occured while deleting.'});
    });
  }

  onNotificationSelect(){
    if(this.groupModel.notification.notificationType === 'TEXT'){
      this.groupModel.notification.message.message = '';
    }
  }

}
