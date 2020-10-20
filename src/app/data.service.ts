import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  isLoginSuccess: boolean;

  constructor() { }

  setLoginData(event: boolean) {
      this.isLoginSuccess = event;
  }
}
