import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from '../auth/authentication.service';
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
  userId: number;
  isBoardCreate = false;
  isBoardEdit = false;
  isBoardDelete = false;
  isPrivatePaginator = false;
  isPublicPaginator = false;
  rowsperPage = 10;
  constructor(private formBuilder: FormBuilder, private httpService: HttpServiceClient,
    private messageService: MessageService, public authService: AuthenticationService) { }

  ngOnInit(): void {
   this.createForm();
   const hrefUrl = document.location.href.split('#');
   if(hrefUrl){
     this.localUrl = hrefUrl[0]+'#/getNotifications?groupName=';
   }
    this.groupTypes = [{label:'Public', value:true},{label:'Private', value:false}];
    this.fetchAllGroups();
    const board = JSON.parse(localStorage.getItem("permission")).filter(e => e.name === 'BOARD');
    if(board && board.length > 0){
      this.isBoardCreate = board[0].isCreate;
      this.isBoardEdit = board[0].isEdit;
      this.isBoardDelete = board[0].isDelete;
    }
  }

  createForm(){
    this.form = this.formBuilder.group({
      groupName: ['',  [Validators.required, Validators.minLength(3)]],
      groupType: [true, Validators.required]
    });
  }
  get f() { return this.form.controls; }

  showAddBoardDialog() {
    this.display = true;
  }
  createGroup() {
    this.submitted = true;
    this.isCreateError = false;
    this.errorMessage = '';
    if (this.form.invalid) {
      this.isCreateError = true;
      if(this.form.controls.groupName.errors.required){
        this.errorMessage = 'Board name required.';
        return;
      } 
      if(this.form.controls.groupName.errors && this.form.controls.groupName.errors.minlength &&
        this.form.controls.groupName.errors.minlength.actualLength < 4){
        this.errorMessage = 'Board name should be minimum 3 characters';
        return;
      }
      
    }
    let message = '';
    let errMsg = '';
    const groupReq = new Groups();
    groupReq.groupName = this.form.value.groupName;
    groupReq.isPublic = this.form.value.groupType;
    if(this.authService.currentUserValue && this.authService.currentUserValue.results){
    groupReq.createdBy = this.authService.currentUserValue.results.id;
    }
    if(this.groupId !== 0){
      groupReq.groupId = this.groupId;
      message = 'Board detais updated successfully';
      errMsg = 'Error occured while updating board details';
    } else {
      message = 'New Board added successfully';
      errMsg = 'Error occured while adding board details';
    }
    this.httpService.createBoard(groupReq).subscribe((res) =>{
      this.onDialogClose(true);
      this.messageService.add({severity:'success', summary: 'Success', detail: message});
    },error => {
      if(error.error && error.error.message){
        this.messageService.add({severity:'error', summary: 'Error', detail: error.error.message});
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail: errMsg});
      }
     this.isCreateError = true;
    });
  }
  onGroupTypeSelect(){
    this.enableorDisableSubmit();
  }

  onGroupNameChange(){
    if(!this.form.controls.groupName.errors){
      this.errorMessage = '';
      this.isCreateError = true;
    }
    this.enableorDisableSubmit();
  }

  onDialogClose(isData: boolean){
    this.display = false;
    this.submitted = false;
    this.isCreateError = false;
    this.errorMessage = '';
    this.groupId = 0;
    this.createForm();
    if(isData){
      this.fetchAllGroups();
    }
  }

  fetchAllGroups(){
    if (!this.authService.currentUserValue) return;
    this.httpService.getOwnerGroups(this.authService.currentUserValue.results.username).subscribe((res) => {
      if(res){
       this.publicGroups = res.filter(s => s.isPublic);
       this.privateGroups = res.filter(s => !s.isPublic);
       if(this.privateGroups && this.privateGroups.length > this.rowsperPage){
        this.isPrivatePaginator = true;
       } else{
        this.isPrivatePaginator = false;
       }
       if(this.publicGroups && this.publicGroups.length > this.rowsperPage){
        this.isPublicPaginator = true;
       } else{
        this.isPublicPaginator = false;
       }
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
      groupName: [event.groupName, [Validators.required, Validators.minLength(3)]],
      groupType: [groupType, Validators.required]
    });
    this.groupId = event.groupId;
  }

  onDeleteRow(event: any){
    const req = new Groups();
    req.groupId  = event.groupId;
    this.httpService.deleteBoard(req).subscribe((res) =>{
      this.messageService.add({severity:'success', summary: 'Success', detail: 'Board deleted successfully;'});
      this.fetchAllGroups();
    }, error => {
      if(error.error && error.error.message){
        this.messageService.add({severity:'error', summary: 'Error', detail: error.error.message});
      }
    });
  }

}
