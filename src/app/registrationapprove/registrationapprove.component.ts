import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';
import { UserStatus } from '../model/users.model';

@Component({
  selector: 'app-registrationapprove',
  templateUrl: './registrationapprove.component.html',
  styleUrls: ['./registrationapprove.component.css']
})
export class RegistrationapproveComponent implements OnInit {

  userDetails: UserStatus[];
  isapprovEdit = false;
  constructor(private httpService: HttpServiceClient,private authService: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.fetchOwnerGroupUsers();
    const approv = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'INVITATION_APPROVALS');
    if(approv && approv.length > 0){
      this.isapprovEdit = approv[0].isEdit;
    
    }
  }

  fetchOwnerGroupUsers(){
    if(!this.authService.currentUserValue) return;
    this.httpService.getOwnerGroupUsers(this.authService.currentUserValue.results.username).subscribe((res) => {
      if(res){
       this.userDetails = res.filter(s => !s.isPublic);
      }
    }, error => {
      console.log(error);
    });
  }
    
  onApproveOrReject(event: any, isApprove: boolean){
    if(isApprove){
      event.isActive = true;
    }else{
      event.isActive = false;
    }
    this.httpService.authenticateAndUpdateUser(event).subscribe(res => {
      if(res && res.message)
      this.messageService.add({severity:'success', summary: 'Success', detail: res.message});
      this.fetchOwnerGroupUsers();
    }, err => {
      this.messageService.add({severity:'error', summary: 'Error', detail: err});
      this.fetchOwnerGroupUsers();
    });
  }
}
