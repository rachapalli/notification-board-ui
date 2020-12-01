import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitemembersComponent } from './invitemembers.component';

describe('InvitemembersComponent', () => {
  let component: InvitemembersComponent;
  let fixture: ComponentFixture<InvitemembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitemembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitemembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
