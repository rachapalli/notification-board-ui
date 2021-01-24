import { Component, OnInit, ViewChild } from '@angular/core';
import { TabView } from 'primeng/tabview';

@Component({
  selector: 'app-boardmember',
  templateUrl: './boardmember.component.html',
  styleUrls: ['./boardmember.component.css']
})
export class BoardmemberComponent implements OnInit {

  index = 0;
  innertabIndex = 0;
  map: any;
  isInviteView = false;
  isBoardView = false;
  isNotificationView = false;
  isBoardOwnerView = false;
  isMemberView = false;
  allRegUsersView = false;
  selectedIndex = 0;
  selectedInnerTabIndex = 0;
  @ViewChild('mainTab') tabView: TabView;
  @ViewChild('innerTab') innerTab: TabView;
  header = '';
  innerHeader = '';
  constructor() { }

  ngOnInit(): void {
    this.map = JSON.parse(localStorage.getItem("permission"));
    const board = this.map.filter(e => e.name === 'BOARD');
    if(board && board.length > 0){
      this.isBoardView = board[0].isView;
    }
    const invite = this.map.filter(e => e.name === 'INVITATION');
    if(invite && invite.length > 0){
      this.isInviteView = invite[0].isView;
    }
    const notification = this.map.filter(e => e.name === 'NOTIFICATIONS');
    if(notification && notification.length > 0){
      this.isNotificationView = notification[0].isView;
    }
    const boardOwner = this.map.filter(e => e.name === 'ALL_BOARD_OWNERS');
    if(boardOwner && boardOwner.length > 0){
      this.isBoardOwnerView = boardOwner[0].isView;
    }
    const member = this.map.filter(e => e.name === 'ALL_BOARDS');
    if(member && member.length > 0){
      this.isMemberView = boardOwner[0].isView;
    }
    const allUsers = this.map.filter(e => e.name === 'ALL_USERS');
    if(allUsers && allUsers.length > 0){
      this.allRegUsersView = allUsers[0].isView;
    }
    
    setTimeout(() => {
      this.setMainHeader();
    },1);
  }

  handleChange(event: any){
    this.index = event.index;
    this.selectedIndex = event.index;
    this.setMainHeader();
  }

  setMainHeader(){
    this.header = this.tabView.tabs[this.selectedIndex].header;
    if(this.header === 'Invite Members'){
      setTimeout(() => {
        this.setinnerTabHeader();
      },1);
    }
  }

  setinnerTabHeader(){
    this.innerHeader = this.innerTab.tabs[this.selectedInnerTabIndex].header;
  }

  handleInnerTabChange(event: any){
    this.innertabIndex = event.index;
    this.selectedInnerTabIndex = event.index;
    this.setinnerTabHeader();
  }
}
