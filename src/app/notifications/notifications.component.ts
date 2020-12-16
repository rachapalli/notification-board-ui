import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  urlSafe: SafeResourceUrl;
  excelUrlSafe: SafeResourceUrl;
  docurlSafe: SafeResourceUrl;
  localImage = 'assets/image.png';
  isNotificationCreate = false;
  isNotificationEdit = false;
  isNotificationDelete = false;
  constructor(private httpService: HttpServiceClient, public authService: AuthenticationService, private messageService: MessageService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.fetchGroups();
    this.groupModel.notification.notificationType = 'TEXT';
    this.globalNotificationType = null;
    this.groupModel.notification.message = new MessageCls();
    this.notificationTypeOpt = [{ label: 'Text', value: 'TEXT' }, { label: 'File', value: 'FILE' }];
    this.notificationTypeSelect = [{ label: 'All', value: null }, { label: 'Text', value: 'TEXT' }, { label: 'File', value: 'FILE' }];
    const board = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'NOTIFICATIONS');
    if(board && board.length > 0){
      this.isNotificationCreate = board[0].isCreate;
      this.isNotificationEdit = board[0].isEdit;
      this.isNotificationDelete = board[0].isDelete;
    }
  }

  fetchGroups() {
    if (!this.authService.currentUserValue) return;
    this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
      if (res) {
        this.totalGroups = [{ label: 'All', value: null }];
        const activeGroups = res.filter(e => e.isActive)
        for (const groupData of activeGroups) {
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
  filterNotifications() {
    if (this.globalNotificationType === 'TEXT') {
      this.privateNotifications = this.privateNotifications.filter(r1 => r1.notification.notificationType === 'TEXT');
      this.publicNotifications = this.publicNotifications.filter(r1 => r1.notification.notificationType === 'TEXT');
    } else if (this.globalNotificationType === 'FILE') {
      this.privateNotifications = this.privateNotifications.filter(r1 => r1.notification.notificationType === 'FILE');
      this.publicNotifications = this.publicNotifications.filter(r1 => r1.notification.notificationType === 'FILE');
      this.fetchFiles(this.privateNotifications, false);
      this.fetchFiles(this.publicNotifications, true);
    } else {
      this.fetchFiles(this.privateNotifications, false);
      this.fetchFiles(this.publicNotifications, true);
    }
  }
  onGroupSelect(event: any) {
    if (!event.value) {
      this.fetchUserGroupNotifications();
      return;
    }
    let groupName = null;
    if (this.totalGroups && this.mainGroupModel.groupId) {
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
    if (this.totalGroups && this.mainGroupModel.groupId) {
      const group = this.totalGroups.filter(t => t.value === this.mainGroupModel.groupId);
      groupName = group[0].label;
    }
    this.httpService.getUserGRoupNotifications(this.authService.currentUserValue.results.username, groupName).subscribe((res) => {
      if (res) {
        this.isPublicSelect = true;
        this.publicNotifications = res.filter(r1 => this.publicGroups.some(r2 => r1.groupId === r2.value));
        this.privateNotifications = res.filter(r1 => this.privateGroups.some(r2 => r1.groupId === r2.value));
        if (this.mainGroupModel.groupId) {
          this.publicNotifications = this.publicNotifications.filter(s => s.groupId === this.mainGroupModel.groupId);
          this.privateNotifications = this.privateNotifications.filter(s => s.groupId === this.mainGroupModel.groupId);
        }
        if (this.publicNotifications && this.publicNotifications.length === 0 && this.privateNotifications && this.privateNotifications.length > 0) {
          this.isPublicSelect = false;
        }
        this.filterNotifications();
      }
    }, error => {
      console.log(error);
    });

  }

  async fetchFiles(res: any, isPublic: boolean) {
    if (!res) return;
    for (let i = 0; i < res.length; i++) {
      let fileKeyObj = res[i];
      if (fileKeyObj.notification && fileKeyObj.notification.notificationType === 'FILE' && fileKeyObj.notification.file &&
        fileKeyObj.notification.file.fileKey) {
        let response = null;
        const format = fileKeyObj.notification.file.fileKey.split('.');
        if (format) {
          fileKeyObj.fileFormat = format[format.length - 1].toLowerCase();
        }
        if (fileKeyObj.fileFormat !== 'pdf' && fileKeyObj.fileFormat !== 'xlsx' && fileKeyObj.fileFormat !== 'docx') {
          response = await this.httpService.getImageWithFileKey(fileKeyObj.notification.file.fileKey).catch(e =>
            console.log(e.message));
          console.log(fileKeyObj.notification.file.fileKey);
          this.createImageFromBlob(response, fileKeyObj);
        }
        
      }
          if (i === res.length - 1) {
            if (isPublic) this.publicNotifications = res;
            if (!isPublic) this.privateNotifications = res;
          }
    }
  }

  createImageFromBlob(image: any, fileObj: any) {
    if (!image || image === 'error') return;
    let reader = new FileReader();
    reader.onload = (e: any) => {
      let res = reader.result;

      if (fileObj.fileFormat === 'pdf' || fileObj.fileFormat === 'docx' || fileObj.fileFormat === 'xlsx') {
        fileObj.notification.file.fileKey = image;
      } else if (res && res.toString().includes('data:application/octet-stream;base64')) {
        fileObj.notification.file.fileKey = reader.result.toString().replace('data:application/octet-stream;base64', 'data:image/jpeg;base64');
      }
    };

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  showAddNotifyDialog() {
    this.display = true;
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    this.onGroupTypeSelect({ value: true });
    this.enableorDisableSubmit();
  }
  uploadFile() {
    this.httpService.uploadFile(this.uploadFileVal).subscribe((res) => {
      this.groupModel.notification.file.name = res.name;
      this.groupModel.notification.file.fileId = res.fileId;
      this.saveNotification();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured while uploading file.' });
    });
  }

  addNotification() {
    if (this.groupModel.notification.notificationType === 'FILE') {
      this.groupModel.notification.message = null;
      if(this.groupModel.notification.file.fileId){
        this.saveNotification();
      }else{
      this.uploadFile();
      }
    } else {
      this.groupModel.notification.file = null;
      this.saveNotification();
    }
  }
  saveNotification() {
    this.enableorDisableSubmit();
    let message = '';
    if (this.authService.currentUserValue) {
      this.groupModel.createdBy = this.authService.currentUserValue.results.id;
    }
    if (this.notificationId !== 0) {
      this.groupModel.notificationId = this.notificationId;
      message = 'Notification details updated successfully';
    } else {
      message = 'Notification added successfully';
    }
    this.httpService.createorUpdateNotification(this.groupModel).subscribe((res) => {
      this.onDialogClose(true);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }, err => {
      let errMessage = '';
      let error = '';
      if (err.error && err.error.message) {
        error = err.error.message;
        if (err.error.details && err.error.details[0]) {
          errMessage = err.error.details[0];
          this.messageService.add({ severity: 'error', summary: error, detail: errMessage });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
        }
      } else {
        if (this.notificationId !== 0) {
          errMessage = 'Error occured while updating notification details.';
        } else {
          errMessage = 'Error occured while adding notification';
        }
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errMessage });
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

  onImageClick(event: any, format: string) {
    let createdFile = null;
    if (event.length > 1000) {
      this.imageSrc = event;
      this.isImage = true;
      return;
    }
    if(format !== 'pdf' && format !== 'xlsx' && format !== 'docx'){
      this.messageService.add({ severity: 'warn',  detail: 'No Image Found' });
      return;
    }
    
    let reader = new FileReader();
    this.httpService.getImageWithFileKeyObserver(event).subscribe(response => {
      // this.createImageFromBlob(response, createdFile);

      reader.onload = (e: any) => {
        let result = reader.result;
          if (format === 'pdf') {
          result = result.toString().replace('application/octet-stream', 'application/pdf');
          this.isImage = true;
            this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(result.toString());
        } else if (format === 'docx') {
          result = result.toString().replace('application/octet-stream', ' application/vnd.openxmlformats-officedocument.wordprocessingml.document');
          this.isImage = true;
            this.docurlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(result.toString());
            setTimeout(() => {
              this.isImage = false;
            },1);
        } 
        else if (format === 'xlsx') {
          this.isImage = true;
          result = result.toString().replace('application/octet-stream', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            this.excelUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(result.toString());
            setTimeout(() => {
              this.isImage = false;
            },1);
        }
      }
      if (response) {
        reader.readAsDataURL(response);
      }
    }, err => {
      this.messageService.add({ severity: 'warn',  detail: 'No File Found' });
    });


  }

  onImageDialogClose() {
    this.isImage = false;
    this.imageSrc = null;
    this.urlSafe = null;
    this.excelUrlSafe = null;
    this.docurlSafe = null;
  }
  onGroupTypeSelect(event: any) {
    if (this.authService.currentUserValue) {
      this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
        if (res) {
          this.groupsData = [{ label: 'Select Board', value: null }];
          for (const groupData of res.filter(s => s.isPublic === event.value)) {
            if(groupData.isActive){
              this.groupsData.push({ label: groupData.groupName, value: groupData.groupId });
            }
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
    if (isData)
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
    if (this.isPublic) {
      this.groupsData = this.publicGroups;
    } else {
      this.groupsData = this.privateGroups;
    }
    this.groupModel.groupId = event.groupId;
    this.display = true;
    this.notificationId = event.notificationId;
    if (event.notification.message) {
      req.message.message = event.notification.message.message;
      req.message.messageId = event.notification.message.messageId;
    }
    if (event.notification.file) {
      req.file.fileId = event.notification.file.fileId;
      req.file.fileKey = event.notification.file.fileKey;
    }
    this.groupModel.notification = req;
    this.enableorDisableSubmit();
  }

  onDeleteRow(event: any) {
    if (!event.isActive) return;
    let req = new CreateGroupModel();
    req.groupId = event.groupId;
    req.notificationId = event.notification.notificationId;
    req.updatedBy = event.notification.updatedBy;
    this.httpService.deleteNotification(req).subscribe(res => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      this.fetchUserGroupNotifications();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error occured while deleting.' });
    });
  }

  onNotificationSelect() {
    if (this.groupModel.notification.notificationType === 'TEXT') {
      this.groupModel.notification.message.message = '';
    }
  }

}
