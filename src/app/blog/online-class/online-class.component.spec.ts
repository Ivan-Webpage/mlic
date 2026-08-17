import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

import { OnlineClassComponent } from './online-class.component';
import { makeMeta } from '../../makeMeta';

describe('OnlineClassComponent', () => {
  let component: OnlineClassComponent;
  let fixture: ComponentFixture<OnlineClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ OnlineClassComponent ],
      providers: [
        makeMeta,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { cls: 'crawler_king', id: '80' } } } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlineClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
