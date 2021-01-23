import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllboardDetailsComponent } from './allboard-details.component';

describe('AllboardDetailsComponent', () => {
  let component: AllboardDetailsComponent;
  let fixture: ComponentFixture<AllboardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllboardDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllboardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
