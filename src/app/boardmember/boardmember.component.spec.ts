import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardmemberComponent } from './boardmember.component';

describe('BoardmemberComponent', () => {
  let component: BoardmemberComponent;
  let fixture: ComponentFixture<BoardmemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardmemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
