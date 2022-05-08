import {Component, Input, OnInit} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {BookService} from '../../services/book.service';
import {AuthorService} from '../../services/author.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @Input()
  page;
  @Input()
  size;
  isHidden = true;
  private checkedList: Map<number, number>;
  private idBook: number;

  constructor(private checkboxService: CheckboxService, private bookService: BookService, private authorService: AuthorService) {
  }

  ngOnInit(): void {
  }

  /*DeleteABook() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }*/

  // tslint:disable-next-line:typedef
  confirmMethod(id: number) {
    if (confirm('Are you sure to delete book ' + id)) {
      console.log('Implement delete functionality here');
    }
  }

  // tslint:disable-next-line:typedef
  deleteBook() {
    // @ts-ignore
    if (this.checkboxService.lengthBooksMap() === 1) {
      this.checkedList = this.checkboxService.getBooksMap();
      const bookId = Number(this.checkedList.keys().next().value);

      if (confirm('Are you sure to delete book ')) {
        this.bookService.deleteBook(bookId);
        this.bookService.getBookListObservable(this.page, this.size);
      }
    }
    if (this.checkboxService.lengthBooksMap() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
    }
    // @ts-ignore
    if (this.checkboxService.lengthBooksMap() === 0) {
      alert('Brak zaznaczonego');
    }

  }

  /*deleteAuthor() {
    // @ts-ignore
    if (this.checkboxService.lengthAuthorsMap() === 1) {
      this.checkedList = this.checkboxService.getAuthorsMap();
      const authorId = Number(this.checkedList.keys().next().value);

      if (confirm('Are you sure to delete book ')) {
        this.authorService.deleteAuthor(authorId);
        this.bookService.getBookListObservable(this.page, this.size);
      }
    }
    if (this.checkboxService.lengthBooksMap() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
    }
    // @ts-ignore
    if (this.checkboxService.lengthBooksMap() === 0) {
      alert('Brak zaznaczonego');
    }

  }*/
}


