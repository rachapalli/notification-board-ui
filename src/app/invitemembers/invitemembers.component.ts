import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { Invitation } from '../model/invitation.model';

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
  invationModel = new Invitation();
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
    if (this.invationModel) {
      this.invationModel.message = '';
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
      this.invationModel.message = `${this.localUrl + this.boardName}`;
      // this.invationModel.message =  "<a target='_blank' href='"+ this.localUrl + this.boardName + "'>";
    } else {
      this.invationModel.message = '';
    }
  }
  showInvitationDialog() {
    this.isButtonDisabled = true;
    this.groupTypes = [{ label: 'Public', value: true }, { label: 'Private', value: false }];
    this.invationModel = new Invitation();
    this.display = true;
    this.onGroupTypeSelect(true);
  }

  onEmailAdd(event: any) {
    const regularExpression = /^.{3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regularExpression.test(String(event.value).toLowerCase())) {
      let index = this.invationModel.email.findIndex(d => d === event.value); //find index in your array
      this.invationModel.email.splice(index, 1);
      this.messageService.add({ severity: 'warn', detail: 'Please enter correct email.' });
    }
  }

  sendInvitation() {

  }

  onDialogClose() {
    this.display = false;
    this.isButtonDisabled = true;

  }
}
