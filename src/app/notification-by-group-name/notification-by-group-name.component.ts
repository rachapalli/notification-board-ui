import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpServiceClient } from '../http-service-client';
import { GroupNotificationModel } from '../model/group.model';

@Component({
  selector: 'app-notification-by-group-name',
  templateUrl: './notification-by-group-name.component.html',
  styleUrls: ['./notification-by-group-name.component.css']
})
export class NotificationByGroupNameComponent implements OnInit {
  currentRoute: string;
  groupName: string;
  publicNotifications: GroupNotificationModel[];
  constructor(private router: Router, private service: HttpServiceClient,private messageService: MessageService) {
        this.currentRoute = this.router.url;
        const routeArr =  this.router.url.split('/notification/getNotifications/');
        if(routeArr){
          this.groupName = routeArr[1];     
        }
}
  ngOnInit(): void {
    this.service.getNotifications(this.groupName).subscribe( res => {
      if(res){
        this.publicNotifications = res;
      }
    }, () => {
      this.messageService.add({severity:'error', summary:'Error', detail: 'Error Occured While Fetching details with ' + this.groupName});
    });
  }

}
