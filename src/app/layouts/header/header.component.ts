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

  constructor(private router: Router, public dataService: DataService) { }

  ngOnInit(): void {
  }

  handleLogin(){
    console.log("Login Clicked");
    this.router.navigate(['/login']);
  }

  handleLogOut(){
    this.dataService.setLoginData(false);
    this.router.navigate(['*']);
  }
  handleSignUp(){
    console.log("Signup CLicked");
    this.router.navigate(['/registration']);
  }

}
