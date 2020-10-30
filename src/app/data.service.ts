import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  isLoginSuccess: boolean;
  loginUser: string;

  constructor() { }

  setLoginData(event: boolean) {
      this.isLoginSuccess = event;
  }

 setLoginUser(event: string){
   this.loginUser = event;
 }
}
