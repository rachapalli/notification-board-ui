import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { User, UserStatus } from '../model/users.model';

@Component({
  selector: 'app-rolebaseduserdetails',
  templateUrl: './rolebaseduserdetails.component.html',
  styleUrls: ['./rolebaseduserdetails.component.css']
})
export class RolebaseduserdetailsComponent implements OnInit {


  userDetails: User[];
  isapprovEdit = false;
  @Input()
  role: string;
  @ViewChild('table') table: Table;
  isPaginator = false;
  rowsperPage = 10;
  constructor(private httpService: HttpServiceClient, private authService: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchUserDetailsbyRole();
    let approv = null;
    if(this.role === 'Member'){
      approv = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'ALL_USERS');
    }else if(this.role === 'Board Owner'){
      approv = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'ALL_BOARD_OWNERS');
    }
    if (approv && approv.length > 0) {
      this.isapprovEdit = approv[0].isEdit;

    }
  }

  fetchUserDetailsbyRole() {
    if (!this.authService.currentUserValue) return;
    if (!this.role) return;
    this.httpService.getUserDetailsByRole(this.role).subscribe((res) => {
      if (res) {
        res.filter(element => {
          if (element.createdDate) {
            element.date = this.formatDate(new Date(element.createdDate));
          }
        });
        this.userDetails = res.filter(s => !s.isPublic);
        if (this.userDetails && this.userDetails.length > this.rowsperPage) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
      }
    }, error => {
      console.log(error);
    });
  }

  onApproveOrReject(event: any, isApprove: boolean) {
    if (isApprove) {
      event.isApproved = true;
    } else {
      event.isApproved = false;
    }
    this.httpService.approveUser(event).subscribe(res => {
      if (res && res.message)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      this.fetchUserDetailsbyRole();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
      this.fetchUserDetailsbyRole();
    });
  }
  onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'lte')
  }

  formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return  date.getFullYear() + '/' + month + '/' + day;
  }
}
