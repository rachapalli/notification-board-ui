import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoginSuccess = false;
  isLoginDialogOpen = false;
  isRegistrationDisplay = false;
  constructor(private router: Router, public dataService: DataService) { }

  ngOnInit(): void {
  }

  handleLogin(){
    console.log("Login Clicked");
    
    this.isLoginDialogOpen = true;
    this.isRegistrationDisplay = false;
  }

  handleLogOut(){
    this.dataService.setLoginData(false);
    this.router.navigate(['*']);
  }
  handleSignUp(){
    console.log("Signup CLicked");
   
    this.isRegistrationDisplay = true;
    this.isLoginDialogOpen = false;
  }

  onLogInDialogClose(){
    this.isLoginDialogOpen = false;
  }

  onRegistrationDialogClose(){
    this.isRegistrationDisplay = false;
  }

}
