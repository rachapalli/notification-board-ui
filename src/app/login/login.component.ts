import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  loginDisplay = false;
  isLoginError = false;
  @Output()
  onClose = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private authService: AuthenticationService, private router: Router) { 
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/boardMember']);
  }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  processLogin() {
    console.log("Login clicked");
    this.isLoginError = false;
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value.username,this.form.value.password)
    .pipe(first())
    .subscribe((res) =>{
      this.loading = true;
      this.router.navigate(['/boardMember']);
      this.closeLogin();
    }, (error) =>{
      this.isLoginError = true;
      console.log(error);
    });
    
  }
  onChange(){
    this.isLoginError = false;
  }
  closeLogin() {
    this.onClose.emit();
  }

}
