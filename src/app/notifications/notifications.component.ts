import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataService } from '../data.service';
import { HttpServiceClient } from '../http-service-client';
import { CreateGroupModel, GroupNotificationModel } from '../model/group.model';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

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
  mainGroupModel = new CreateGroupModel();
  groupModel = new CreateGroupModel();
  publicNotifications: GroupNotificationModel[];
  privateNotifications: GroupNotificationModel[];
  publicGroups: any;
  privateGroups: any;
  userId: any;
  isImage = false;
  imageSrc: any;
  
  constructor(private httpService: HttpServiceClient,public dataService: DataService) { }

  ngOnInit(): void {
    this.fetchGroups();
  }

  fetchGroups() {
    if (!this.dataService.loginUser) return;
    this.httpService.getOwnerGroups(this.dataService.loginUser).subscribe((res) => {
      if (res) {
        this.totalGroups = [{ label: 'Select Board', value: null }];
        for (const groupData of res) {
          this.totalGroups.push({ label: groupData.groupName, value: groupData.groupId, ref: groupData.isPublic });
        }
        this.publicGroups = this.totalGroups.filter(t => t.ref);
        // this.privateGroups = this.totalGroups.filter(t => !t.ref);
        this.fetchUserGroupNotifications();
      }
    }, error => {
      console.log(error);
    });

  }

  onGroupSelect(event: any) {
    if (!event.value) {
      this.fetchUserGroupNotifications();
      return;
    }
    this.httpService.getUserGRoupNotifications(this.dataService.loginUser).subscribe((res) => {
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
      }
    }, error => {
      console.log(error);
    });
  }
  fetchUserGroupNotifications() {
    this.httpService.getUserGRoupNotifications(this.dataService.loginUser).subscribe((res) => {
      if (res) {
        this.isPublicSelect = true;
        
        this.publicNotifications = res.filter(r1 => this.publicGroups.some(r2 => r1.groupId === r2.value));
        if(this.mainGroupModel.groupId){
          this.publicNotifications = this.publicNotifications.filter(s => s.groupId === this.mainGroupModel.groupId);
        }
        // this.privateNotifications = res.filter(r1 => this.privateGroups.some(r2 => r1.groupId === r2.value));
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
  addNotification() {
    this.enableorDisableSubmit();
    if(this.dataService.userDetails){
    this.groupModel.createdBy = this.dataService.userDetails.userId;
    }
    this.httpService.createNotification(this.groupModel).subscribe((res) => {
      this.onDialogClose(true);
    }, err => {
      this.isCreateError = true;
      this.errorMessage = err.statusText;
    });
  }

  textChanged(event: any) {
    this.groupModel.message = event;
    this.enableorDisableSubmit();
  }
  onFileUpload(event: any) {
    this.filedetails = event.files.length;
    this.enableorDisableSubmit();
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
    if (this.dataService.loginUser) {
      this.httpService.getOwnerGroups(this.dataService.loginUser).subscribe((res) => {
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
    if (((this.groupModel.message && this.groupModel.message != '') || (this.filedetails && this.filedetails != 0)) && this.groupModel.groupId) {
      this.isButtonDisabled = false;
    } else {
      this.isButtonDisabled = true;
    }
  }
  onDialogClose(isData: boolean) {
    this.display = false;
    this.groupModel = new CreateGroupModel();
    this.groupTypes = [];
    this.isCreateError = false;
    this.errorMessage = '';
    this.isPublic = true;
    if(isData)
    this.fetchGroups();
  }

  onEditRow(event: any) {
    this.groupModel = new CreateGroupModel();
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    this.groupsData = this.publicGroups;
    this.groupModel.message = event.message;
    this.groupModel.groupId = event.groupId;
    this.isPublic = this.publicGroups.some(group => group.value === event.groupId);
    this.display = true;
    this.enableorDisableSubmit();
  }

  onDeleteRow(event: any) {
    console.log(event);
  }

}
