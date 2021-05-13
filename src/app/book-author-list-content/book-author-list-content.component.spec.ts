import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAuthorListContentComponent } from './book-author-list-content.component';

describe('BookAuthorListContentComponent', () => {
  let component: BookAuthorListContentComponent;
  let fixture: ComponentFixture<BookAuthorListContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAuthorListContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAuthorListContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
