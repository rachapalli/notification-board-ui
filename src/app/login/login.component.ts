import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../auth/authentication.service';
import { HttpServiceClient } from '../http-service-client';

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
  isNormalLogin = true;
  isForgotScreen = false;
  isPasswordChageReq = false;
  disableSubmit = true;
  issubmitError = false;
  username: string;
  newPassword: string;
  confNewPassword: string;
  passwordError = false;
  passwordErrorMsg = '';
  errorMessage = 'Invalid Username And/or Password';
  @Output()
  onClose = new EventEmitter();

  @Input()
  headerText= '';

  @Input()
  isLoginDisplay = false;

  constructor(private formBuilder: FormBuilder,private authService: AuthenticationService, 
    private router: Router, private httpService: HttpServiceClient, private messageService: MessageService) { 
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
     this.routeRequiredPath(res);
    }, (error) =>{
      localStorage.removeItem('prevUrl');
      this.isLoginError = true;
      if(error && error.error)
      this.errorMessage = error.error.message;
      console.log(error);
    });
    
  }

  routeRequiredPath(res: any){
    if(res && res.results.isTempPwd){
      this.resetScreen();
      this.isPasswordChageReq = true;
    }else {
    if(localStorage.getItem('prevUrl')){
      location.href = localStorage.getItem('prevUrl');
      localStorage.removeItem('prevUrl');
     }else {
    this.router.navigate(['/boardMember']);
     }
    this.closeLogin();
    }
  }
  forgotPassword(){
    this.isForgotScreen = true;
    this.isNormalLogin = false;
  }

  processForgotPassword(){
    if(this.validateEmail()){
      this.issubmitError = false;
      this.httpService.forgotPassword(this.username).subscribe((res)=>{
        this.messageService.add({severity:'success', summary: 'Success', detail: res.message + ' Please check your email'});
        this.resetScreen();
        this.isNormalLogin = true;

      }, err=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message});
      });
    }else{
      this.issubmitError = true;
    }
  }
  updatePassword(){
    if(this.newPassword){
      if(this.newPassword !== this.confNewPassword ){
        this.passwordError = true;
        this.passwordErrorMsg = 'New password and Confirm new password should be same.';
            }else if(this.newPassword.length < 8){
              this.passwordError = true;
              this.passwordErrorMsg = 'Password must be 8 charecters';
            }else{
              this.passwordError = false;
              this.httpService.updatePassword(this.authService.currentUserValue.results.id,
                this.newPassword).subscribe((res) => {
                  this.messageService.add({severity:'success', summary: 'Success', detail: 'Password ' + res.message });
                  this.routeRequiredPath(res);
                }, err=>{
                  this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message});
                });
            }
    }else{
      this.passwordError = true;
      this.passwordErrorMsg = 'Password required.';
    }
  }
  validateEmail() {
    if(this.username){
      this.disableSubmit = false;
    }
    const regularExpression = /^.{3,}@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(this.username).toLowerCase());
   }

  onChange(){
    this.isLoginError = false;
  }
  closeLogin() {
    this.onClose.emit();
  }

  resetScreen(){
    this.isForgotScreen = false;
    this.isNormalLogin = false;
    this.isPasswordChageReq = false;
  }

}
