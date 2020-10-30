import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericdialogComponent } from './genericdialog.component';

describe('GenericdialogComponent', () => {
  let component: GenericdialogComponent;
  let fixture: ComponentFixture<GenericdialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericdialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
