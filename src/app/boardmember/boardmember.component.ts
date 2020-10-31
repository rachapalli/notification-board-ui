import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boardmember',
  templateUrl: './boardmember.component.html',
  styleUrls: ['./boardmember.component.css']
})
export class BoardmemberComponent implements OnInit {

  index = 0;
  
  constructor() { }

  ngOnInit(): void {
    
  }

  handleChange(event: any){
    this.index = event.index;
  }

}
