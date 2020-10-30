import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  showAddBoardDialog() {
    this.display = true;
  }
  addBoards() {
    this.enableorDisableSubmit();
  }

  textChanged(event: any) {
    this.textAreaData = event;
    this.enableorDisableSubmit();
  }
  onFileUpload(event: any) {
    this.filedetails = event.files.length;
    this.enableorDisableSubmit();
  }

  onFileRmoved() {
    this.filedetails = 0;
    this.enableorDisableSubmit();
  }

  enableorDisableSubmit(){
    if ((this.textAreaData && this.textAreaData != '') || (this.filedetails && this.filedetails != 0)) {
      this.isButtonDisabled = false;
    }else{
      this.isButtonDisabled = true;
    }
  }

}
