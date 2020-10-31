import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpServiceClient } from '../http-service-client';
import { Groups } from '../model/group.model';


@Component({
  selector: 'app-board-details',
  templateUrl: './board-details.component.html',
  styleUrls: ['./board-details.component.css']
})
export class BoardDetailsComponent implements OnInit {

  display: boolean = false;
  textAreaData: string;
  filedetails: any;
  isButtonDisabled = true;
  form: FormGroup;
  submitted: boolean;
  groupTypes: any;
  isCreateError = false;
  errorMessage = '';
  publicGroups: Groups[];
  privateGroups: Groups[];
  constructor(private formBuilder: FormBuilder, private httpService: HttpServiceClient) { }

  ngOnInit(): void {
   this.createForm();
    this.groupTypes = [{label:'Public', value:true},{label:'Private', value:false}];
    this.fetchAllGroups();
  }
  createForm(){
    this.form = this.formBuilder.group({
      groupName: ['', Validators.required],
      groupType: [true, Validators.required]
    });
  }
  get f() { return this.form.controls; }

  showAddBoardDialog() {
    this.display = true;
  }
  createGroup() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.httpService.createGroup(this.form.value.groupName, this.form.value.groupType).subscribe((res) =>{
      this.onDialogClose();
    },error => {
     this.isCreateError = true;
     this.errorMessage = error.error.error;
    });
  }
  onGroupTypeSelect(){
    this.enableorDisableSubmit();
  }

  onGroupNameChange(){
    this.enableorDisableSubmit();
  }

  onDialogClose(){
    this.display = false;
    this.submitted = false;
    this.isCreateError = false;
    this.errorMessage = '';
    this.createForm();
    this.fetchAllGroups();
  }

  fetchAllGroups(){
    this.httpService.getGroups().subscribe((res) => {
      if(res){
       this.publicGroups = res.filter(s => s.isPublic);
       this.privateGroups = res.filter(s => !s.isPublic);
      }
    }, error => {
      console.log(error);
    });
  }

  enableorDisableSubmit(){
    if ((this.form.value.groupName && this.form.value.groupName != '') && (this.form.value.groupType && this.form.value.groupType != 0)) {
      this.isButtonDisabled = false;
    }else{
      this.isButtonDisabled = true;
    }
  }

}
