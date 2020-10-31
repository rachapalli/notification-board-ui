import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { HttpServiceClient } from '../http-service-client';
import { users } from '../model/users.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  @Output()
  onClose = new EventEmitter();
  model = new users();
  userTypes: SelectItem[];
  constructor(private httpService: HttpServiceClient) { }

  ngOnInit(): void {
    this.userTypes = [{label:'User Type', value:null}];
    this.httpService.getUserTypes().subscribe((res) => {
      for(let user of res){
        this.userTypes.push({label:user, value:user});
      }
    });
  }

  processSignUp(){
    this.httpService.registerNewUser(this.model).subscribe((res) => {
      this.onClose.emit({isRegistrationSuccess: true});
    },error => {
      console.log(error);
    });
  }

  closeSignUp(){
    this.onClose.emit({isRegistrationSuccess: false});
  }
}
