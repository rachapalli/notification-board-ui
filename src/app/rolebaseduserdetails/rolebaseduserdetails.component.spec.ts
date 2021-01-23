import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolebaseduserdetailsComponent } from './rolebaseduserdetails.component';

describe('RolebaseduserdetailsComponent', () => {
  let component: RolebaseduserdetailsComponent;
  let fixture: ComponentFixture<RolebaseduserdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolebaseduserdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolebaseduserdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
