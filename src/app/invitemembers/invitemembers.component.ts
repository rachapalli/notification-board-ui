import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { subscribeOn } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { BoardInvitation, Invitation } from '../model/invitation.model';

@Component({
  selector: 'app-invitemembers',
  templateUrl: './invitemembers.component.html',
  styleUrls: ['./invitemembers.component.css']
})
export class InvitemembersComponent implements OnInit {

  invitations: any;
  isError= false;
  groupTypes: SelectItem[];
  publicGroups: any;
  privateGroups: any;
  totalGroups: any;
  isPublic = true;
  groupsData: SelectItem[];
  localUrl = "";
  invitationModel = new BoardInvitation();
  display: boolean;
  allowDuplicateEmail = false;
  isInviteCreate = false;
  errorMessage = '';
  isSubmitClicked = false;
   constructor(private httpService: HttpServiceClient,
    private messageService: MessageService, public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.fetchAllInvitations();
    const hrefUrl = document.location.href.split('#');
    if (hrefUrl) {
      this.localUrl = hrefUrl[0]+'#/getNotifications?groupName=';
    }
    const invite = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'INVITATION_LIST');
    if(invite && invite.length > 0){
      this.isInviteCreate = invite[0].isCreate;
    }
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

      }
    }, error => {
      console.log(error);
    });

  }

  fetchAllInvitations() {
    if (!this.authService.currentUserValue) return;
    
    this.httpService.getUserInvitations(this.authService.currentUserValue.results.username).subscribe(res => {
      this.publicGroups = res.filter(s => s.isPublic);
      this.privateGroups = res.filter(s => !s.isPublic);
    }, error => {

    });
  }

  onGroupTypeSelect(event: any) {
    if (this.invitationModel) {
      this.invitationModel.emailBody = '';
    }
    if (this.authService.currentUserValue) {
      this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
        if (res) {
          this.groupsData = [{ label: 'Select Board', value: null }];
          for (const groupData of res.filter(s => s.isPublic === event.value)) {
            if(groupData.isActive){
            this.groupsData.push({ label: groupData.groupName, value: groupData.groupName });
            }
          }
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onBoardSelect() {
    if (this.invitationModel.groupName) {
      this.invitationModel.emailBody = `${this.localUrl + this.invitationModel.groupName}`;
    } else {
      this.invitationModel.emailBody = '';
    }
    this.validateTemplate();
  }
  showInvitationDialog() {
    this.isError = false;
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    this.invitationModel = new BoardInvitation();
    this.display = true;
    this.onGroupTypeSelect({value: true});
  }

  onEmailAdd(event: any) {
    const regularExpression = /^.{3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regularExpression.test(String(event.value).toLowerCase())) {
      let index = this.invitationModel.emailIdList.findIndex(d => d === event.value); //find index in your array
      this.invitationModel.emailIdList.splice(index, 1);
      this.messageService.add({ severity: 'warn', detail: 'Please enter correct email.' });
    }
    this.validateTemplate();
  }
  
  validateTemplate(): boolean{
    if(this.isSubmitClicked){
    if(!this.invitationModel.groupName){
      this.errorMessage = "Please Select Board.";
      this.isError = true;
      return false;
    }
    if(!this.invitationModel.emailIdList){
      this.errorMessage = "Please Enter Valid Email Address.";
      this.isError = true;
      return false;
    }
    if(this.invitationModel.emailIdList && this.invitationModel.emailIdList.length === 0){
      this.errorMessage = "Please Enter Valid Email Address.";
      this.isError = true;
      return false;
    }
    if(this.invitationModel.emailBody){
      this.isError = false;
      this.invitationModel.emailBody = this.invitationModel.emailBody.replaceAll('<p><br></p>','');
      return true;
    }else{
      this.errorMessage = "Please Enter Valid Message";
      this.isError = true;
      return false;
    }
  }
    return true;
  }
  sendInvitation() {
    this.isError = false;
    this.isSubmitClicked = true;
    if(!this.validateTemplate()){
      return;
    }
  if(this.authService.currentUserValue){
    this.invitationModel.createdBy = this.authService.currentUserValue.results.id;
    }
   
  this.httpService.sendInvitation(this.invitationModel).subscribe( res => {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invitations sent successfully.' });
    this.onDialogClose();
    this.fetchAllInvitations();
  }, error => {
    if(error.error && (error.error.message || error.error.detials)){
      this.messageService.add({ severity: 'error', summary: error.error.message, detail: error.error.details[0] });
    }else{
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to send invitations.' });
    }
  });
  }

  onDialogClose() {
    this.display = false;
    this.invitationModel = new BoardInvitation();
    this.isError = false;
    this.isSubmitClicked = false;

  }
}
