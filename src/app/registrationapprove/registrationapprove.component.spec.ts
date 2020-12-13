import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationapproveComponent } from './registrationapprove.component';

describe('RegistrationapproveComponent', () => {
  let component: RegistrationapproveComponent;
  let fixture: ComponentFixture<RegistrationapproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationapproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationapproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
