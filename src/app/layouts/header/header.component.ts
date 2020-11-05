import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  constructor(private router: Router, public dataService: DataService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  handleLogin(){
    this.isLoginDialogOpen = true;
    this.isRegistrationDisplay = false;
  }

  handleLogOut(){
    this.dataService.setLoginData(false);
    this.router.navigate(['*']);
  }
  handleSignUp(){
    this.isRegistrationDisplay = true;
    this.isLoginDialogOpen = false;
  }

  onLogInDialogClose(){
    this.isLoginDialogOpen = false;
  }

  onRegistrationDialogClose(){
    this.isRegistrationDisplay = false;
  }

  showResponseMessages(event: any){
    this.messageService.add({severity:event.severity, summary: event.summary, detail: event.detail});
  }

}
