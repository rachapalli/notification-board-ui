import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationByGroupNameComponent } from './notification-by-group-name.component';

describe('NotificationByGroupNameComponent', () => {
  let component: NotificationByGroupNameComponent;
  let fixture: ComponentFixture<NotificationByGroupNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationByGroupNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationByGroupNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
