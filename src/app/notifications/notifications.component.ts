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
  isCreateError = false;
  errorMessage = '';
  groupTypes: SelectItem[];
  groupsData: SelectItem[];
  groupModel = new CreateGroupModel();
  publicNotifications: GroupNotificationModel[];
  privateNotifications: GroupNotificationModel[];
  constructor(private httpService: HttpServiceClient,private dataService: DataService) { }

  ngOnInit(): void {
   this.fetchUserGroupNotifications();
  }

  fetchUserGroupNotifications(){
    if(this.dataService.loginUser){
    this.httpService.getUserGRoupNotifications(this.dataService.loginUser).subscribe((res) => {
      if(res){
        this.publicNotifications = res.filter(s => s.notificationType === 'public');
        this.privateNotifications = res.filter(s => s.notificationType !== 'public');
       }
    }, error => {
      console.log(error);
    });
    }
  }
  showAddNotifyDialog() {
    this.display = true;
    this.groupTypes = [ {label:'Public', value:true},{label:'Private', value:false}];
    this.onGroupTypeSelect( {value: true});
  }
  addNotification() {
    this.enableorDisableSUbmit();
    this.httpService.createNotification(this.groupModel).subscribe((res) => {
      this.onDialogClose();
    }, err => {
      this.isCreateError = true;
      this.errorMessage = err.statusText;
    });
  }

  textChanged(event: any) {
    this.groupModel.message = event;
    this.enableorDisableSUbmit();
  }
  onFileUpload(event: any) {
    this.filedetails = event.files.length;
    this.enableorDisableSUbmit();
  }

  onFileRmoved() {
    this.filedetails = 0;
    this.enableorDisableSUbmit();
  }
  onGroupTypeSelect(event: any){
    if(this.dataService.loginUser){
    // this.httpService.getOwnerGroups(this.dataService.loginUser, event.value).subscribe((groupsRes) =>{
    //   this.groupsData = [];
    //   if(groupsRes){
    //     for(let group of groupsRes){
    //       this.groupsData.push({label:group.groupName, value:group.groupId});
    //     }
    //   }
    // });
    this.httpService.getGroups().subscribe((res) => {
      if(res){
       this.groupsData = [{label:'Select Group', value:null}];
       for(const groupData of res.filter(s => s.isPublic === event.value)){
        this.groupsData.push({label:groupData.groupName, value:groupData.groupId});
       }
      }
    }, error => {
      console.log(error);
    });
  }
  }

  enableorDisableSUbmit(){
    if ((this.groupModel.message && this.groupModel.message != '') || (this.filedetails && this.filedetails != 0)) {
      this.isButtonDisabled = false;
    }else{
      this.isButtonDisabled = true;
    }
  }
  onDialogClose(){
    this.display = false;
    this.groupModel = new CreateGroupModel();
    this.groupTypes = [];
    this.isCreateError = false;
      this.errorMessage = '';
  }
  
}
