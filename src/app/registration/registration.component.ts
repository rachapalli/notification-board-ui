import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpServiceClient } from '../http-service-client';
import { Users } from '../model/users.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  
  @Output()
  onClose = new EventEmitter();

  @Output()
  onResponseMessages = new EventEmitter();

  model: Users;
  userTypes: SelectItem[];
  isRegistrationClicked: boolean;
  formSubmitted: boolean;
  form: FormGroup;
  constructor(private formBuilder: FormBuilder, private httpService: HttpServiceClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.formSubmitted = false;
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      userType: ['', Validators.required],
      email: ['', Validators.required],
      altEmail: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],

    });
    this.userTypes = [{label:'User Type', value:null}];
    this.httpService.getUserTypes().subscribe((res) => {
      for(let user of res){
        this.userTypes.push({label:user, value:user});
      }
    });
  }

  get f() { return this.form.controls; }

  processSignUp(){
       this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isRegistrationClicked = true;
    this.prepareModelFromForm();
    this.httpService.registerNewUser(this.model).subscribe((res) => {
      this.onClose.emit({isRegistrationSuccess: true});
      this.onResponseMessages.emit({severity:'success', summary: 'Registration Success', detail: 'Details Registerd Successfully'});
      this.isRegistrationClicked = false;
    },error => {
      console.log(error);
      this.onClose.emit({isRegistrationSuccess: false});
      this.onResponseMessages.emit({severity:'error', summary: 'Registration Error', detail: 'Error occured while registring details'});
      this.isRegistrationClicked = false;
    });
  }

  prepareModelFromForm(){
    const formRef= this.form.value;
    this.model = new Users(null, formRef.userName,formRef.password,formRef.email,formRef.altEmail,formRef.mobile,formRef.userType);
  }
  closeSignUp(){
    this.formSubmitted = false;
    this.onClose.emit({isRegistrationSuccess: false});
  }
}
