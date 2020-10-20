import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,private dataService: DataService) { }

  ngOnInit(): void {
  }

  processLogin() {
    console.log("Login clicked");
    this.dataService.setLoginData(true);
    this.router.navigate(['/boardMember']);
  }

}
