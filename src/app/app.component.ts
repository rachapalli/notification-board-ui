import { AfterViewChecked, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked {
  @ViewChild('headerDiv', { static: true }) divView: ElementRef;
  paddingTop = 120;
  headerOffsetHeight = 0;
  title = 'notification-board-ui';
  constructor(private readonly ngZone: NgZone, private dataService: DataService) {

  }

  ngAfterViewChecked() {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        if (this.headerOffsetHeight === 0) {
          this.onWindowResize();
        }
      });
    });
  }

  @HostListener('window:resize')
  onWindowResize() {
    let offsetHeight = 0;
    if (this.divView && this.divView.nativeElement && this.divView.nativeElement.offsetHeight) {
      offsetHeight = this.divView.nativeElement.offsetHeight;
    }
    if(offsetHeight !== 0 && this.headerOffsetHeight !== offsetHeight){
      this.paddingTop = offsetHeight;
    }
  }
}
