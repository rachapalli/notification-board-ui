import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { HttpServiceClient } from '../http-service-client';

@Component({
  selector: 'app-allboard-details',
  templateUrl: './allboard-details.component.html',
  styleUrls: ['./allboard-details.component.css']
})
export class AllboardDetailsComponent implements OnInit {

  isPaginator = false;
  isBoardEdit = false;
  isBoardDelete = false;
  boardOwners: any[];
  rowsperPage = 10;
  @ViewChild('table') table: Table;
  localUrl = "";

  constructor(private httpService: HttpServiceClient, private messageService: MessageService) { }

  ngOnInit(): void {
    const hrefUrl = document.location.href.split('#');
    if (hrefUrl) {
      this.localUrl = hrefUrl[0] + '#/getNotifications?groupName=';
    }
    const board = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'ALL_BOARDS');
    if (board && board.length > 0) {
      this.isBoardEdit = board[0].isEdit;
      this.isBoardDelete = board[0].isDelete;
    }
    this.fetchAllBoards();
  }

  fetchAllBoards() {
    this.httpService.getAllBoards().subscribe((res) => {
      this.boardOwners = [];
      if (res) {
        res.forEach(element => {
          element.url = this.localUrl + element.groupName;
          element.type = element.isPublic ? 'Public' : 'Private';
          if (element.createdDate) {
            element.date = formatDate(element.createdDate, 'yyyy/MM/dd', 'en-US');
          }
        });
        this.boardOwners = res;
        if (this.boardOwners && this.boardOwners.length > this.rowsperPage) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
      }
    }, err => {

    });
  }
  onApproveOrReject(event: any, isApprove: boolean) {
    if (isApprove) {
      event.isApproved = true;
    } else {
      event.isApproved = false;
    }
    this.httpService.approveGroup(event).subscribe(res => {
      if (res && res.message)
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      this.fetchAllBoards();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: err });
      this.fetchAllBoards();
    });
  }

  onDateSelect(value: any) {
    this.table.filter(this.formatDate(value), 'date', 'lte')
  }

  formatDate(date): string {
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    return date.getFullYear() + "/" + month + "/" + day;
  }

}
