import { Output } from '@angular/core';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genericdialog',
  templateUrl: './genericdialog.component.html',
  styleUrls: ['./genericdialog.component.css']
})
export class GenericdialogComponent implements OnInit {

  @Input()
  headerText= '';

  @Input()
  isLoginDisplay = false;

  @Input()
  display = false;

  @Input()
  isRegistrationDisplay = false;
 
  @Output()
  onClose = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {
  }

  onDialogClose(){
    this.onClose.emit();
  }

}
