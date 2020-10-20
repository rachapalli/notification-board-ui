import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  display: boolean = false;
  textAreaData: string;
  filedetails: any;
  isButtonDisabled = true;

  constructor() { }

  ngOnInit(): void {
  }

  showAddNotifyDialog() {
    this.display = true;
  }
  addNotification() {
    this.enableorDisableSUbmit();
  }

  textChanged(event: any) {
    this.textAreaData = event;
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

  enableorDisableSUbmit(){
    if ((this.textAreaData && this.textAreaData != '') || (this.filedetails && this.filedetails != 0)) {
      this.isButtonDisabled = false;
    }else{
      this.isButtonDisabled = true;
    }
  }
}
