import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { DataService } from '../data.service';
import { HttpServiceClient } from '../http-service-client';
import { CreateGroupModel } from '../model/users.model';

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
  groupTypes: SelectItem[];
  groupsData: SelectItem[];
  groupModel = new CreateGroupModel();
  constructor(private httpService: HttpServiceClient,private dataService: DataService) { }

  ngOnInit(): void {
   
  }

  showAddNotifyDialog() {
    this.display = true;
    this.groupTypes = [ {label:'Public', value:true},{label:'Private', value:false}];
    this.onGroupTypeSelect( {value: true});
  }
  addNotification() {
    this.enableorDisableSUbmit();
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
    this.httpService.getOwnerGroups(this.dataService.loginUser, event.value).subscribe((groupsRes) =>{
      this.groupsData = [];
      if(groupsRes){
        for(let group of groupsRes){
          this.groupsData.push({label:group.groupName, value:group.groupId});
        }
      }
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
  }
  
}
