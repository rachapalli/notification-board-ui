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
  isButtonDisabled: boolean;
  groupTypes: SelectItem[];
  publicGroups: any;
  privateGroups: any;
  totalGroups: any;
  isPublic = true;
  groupsData: SelectItem[];
  boardName: any;
  localUrl = "";
  invitationModel = new BoardInvitation();
  display: boolean;
  allowDuplicateEmail = false;

  constructor(private httpService: HttpServiceClient,
    private messageService: MessageService, public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.fetchAllInvitations();
    const hrefUrl = document.location.href.split('#');
    if (hrefUrl) {
      this.localUrl = hrefUrl[0] + '#/notification/getNotifications/';
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
    this.httpService.getAllInvitations().subscribe(res => {
      this.invitations = res;
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
          for (const groupData of res.filter(s => s.isPublic === event)) {
            this.groupsData.push({ label: groupData.groupName, value: groupData.groupName });
          }
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onBoardSelect() {
    if (this.boardName) {
      this.invitationModel.emailBody = `${this.localUrl + this.boardName}`;
      // this.invitationModel.message =  "<a target='_blank' href='"+ this.localUrl + this.boardName + "'>";
    } else {
      this.invitationModel.emailBody = '';
    }
    this.enableorDisableSendButton();
  }
  showInvitationDialog() {
    this.isButtonDisabled = true;
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    this.invitationModel = new BoardInvitation();
    this.display = true;
    this.onGroupTypeSelect(true);
  }

  onEmailAdd(event: any) {
    const regularExpression = /^.{3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regularExpression.test(String(event.value).toLowerCase())) {
      let index = this.invitationModel.emailIdList.findIndex(d => d === event.value); //find index in your array
      this.invitationModel.emailIdList.splice(index, 1);
      this.messageService.add({ severity: 'warn', detail: 'Please enter correct email.' });
    }
    this.enableorDisableSendButton();
  }
  
  enableorDisableSendButton(){
    if(this.boardName && this.invitationModel && this.invitationModel.emailIdList && this.invitationModel.emailBody){
      this.isButtonDisabled = false;
    }else {
      this.isButtonDisabled = true;
    }
  }
  sendInvitation() {
  if(this.authService.currentUserValue){
    this.invitationModel.createdBy = this.authService.currentUserValue.results.id;
    }
  this.httpService.sendInvitation(this.invitationModel).subscribe( res => {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Invitations sent successfully.' });
    this.onDialogClose();
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
    this.isButtonDisabled = true;

  }
}
