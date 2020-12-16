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
  errorMessage = 'Invalid Username And/or Password';
  @Output()
  onClose = new EventEmitter();

  constructor(private formBuilder: FormBuilder,private authService: AuthenticationService, private router: Router) { 
    if (this.authService.currentUserValue) { 
       this.router.navigate(['/boardMember']);
  }
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^.{3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  processLogin() {
    console.log("Login clicked");
    this.isLoginError = false;
    this.submitted = true;
    this.errorMessage = 'Invalid Username And/or Password';
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value.username,this.form.value.password)
    .pipe(first())
    .subscribe((res) =>{
      this.loading = true;
      if(localStorage.getItem('prevUrl')){
        location.href = localStorage.getItem('prevUrl');
        localStorage.removeItem('prevUrl');
       }else {
      this.router.navigate(['/boardMember']);
       }
      this.closeLogin();
    }, (error) =>{
      localStorage.removeItem('prevUrl');
      this.isLoginError = true;
      if(error && error.error)
      this.errorMessage = error.error.message;
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
