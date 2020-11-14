import { Injectable } from '@angular/core';
import { HttpServiceClient } from './http-service-client';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  isLoginSuccess: boolean;
  loginUser: string;
  userDetails: any;
  constructor(private httpService: HttpServiceClient) { }

  setLoginData(event: boolean) {
      this.isLoginSuccess = event;
      if(!event){
        this.userDetails = null;
        this.loginUser = null;
      }
  }

 setLoginUser(event: string){
   this.loginUser = event;
   this.httpService.getUserDetailsWithEmail(this.loginUser).subscribe(res => {
    if (res) {
      this.userDetails = res;
    }
  }, err => {
    console.log(err);
  });
 }
}
