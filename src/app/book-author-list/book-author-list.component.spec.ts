import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAuthorListComponent } from './book-author-list.component';

describe('BookAuthorListComponent', () => {
  let component: BookAuthorListComponent;
  let fixture: ComponentFixture<BookAuthorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookAuthorListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookAuthorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
