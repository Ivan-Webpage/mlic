import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { MarkdownService } from 'ngx-markdown';

import { ArticleComponent } from './article.component';
import { makeMeta } from '../../makeMeta';

describe('ArticleComponent', () => {
  let component: ArticleComponent;
  let fixture: ComponentFixture<ArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ ArticleComponent ],
      providers: [
        makeMeta,
        { provide: ActivatedRoute, useValue: { snapshot: { params: { cls: 'technology', id: '123' } } } },
        { provide: MarkdownService, useValue: { renderer: {} } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
