import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightBottonComponent } from './right-botton.component';

describe('RightBottonComponent', () => {
  let component: RightBottonComponent;
  let fixture: ComponentFixture<RightBottonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightBottonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RightBottonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
