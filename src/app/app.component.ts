import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, ViewChild } from '@angular/core';
import { HttpServiceClient } from './http-service-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewChecked, AfterContentChecked {
  @ViewChild('headerDiv', { static: true }) divView: ElementRef;
  paddingTop = 120;
  headerOffsetHeight = 0;
  title = 'notification-board-ui';
  httpservice: any;
  constructor(private readonly ngZone: NgZone,
    httpService: HttpServiceClient, private cdr: ChangeDetectorRef) {
  this.httpservice = httpService.loaderService;
  }

  ngAfterContentChecked() : void {
    this.cdr.detectChanges();
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
