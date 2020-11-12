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
  groupId: number;
  errorMessage = '';
  publicGroups: Groups[];
  privateGroups: Groups[];
  localUrl = "";
  constructor(private formBuilder: FormBuilder, private httpService: HttpServiceClient) { }

  ngOnInit(): void {
   this.createForm();
   const hrefUrl = document.location.href.split('#');
   if(hrefUrl){
     this.localUrl = hrefUrl[0]+'#/notification/getNotifications/';
   }
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
    const groupReq = new Groups();
    groupReq.groupName = this.form.value.groupName;
    groupReq.isPublic = this.form.value.groupType;
    if(this.groupId !== 0){
      groupReq.groupId = this.groupId;
    }
    this.httpService.createGroup(groupReq).subscribe((res) =>{
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
    this.groupId = 0;
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

  onEditRow(event: any){
    console.log(event);
    this.display = true;
    let groupType = null;
    event.isPublic ? groupType = true : groupType = false;
    this.form = this.formBuilder.group({
      groupName: [event.groupName, Validators.required],
      groupType: [groupType, Validators.required]
    });
    this.groupId = event.groupId;
  }

  onDeleteRow(event: any){
    console.log(event);
  }

}
