import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  baseURL: string;
  constructor() { }
  
  ngOnInit(): void {
    const urlArr = document.location.href.split('#');
    this.baseURL = urlArr[0]+'#';
  }

}
