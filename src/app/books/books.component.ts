import { Component, OnInit } from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {CheckboxService} from '../../services/checkbox.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  // bookslist: Array<Book> = []; // przyjmuje książki i wyswietla je
  bookId: string;
  bookslist: Observable<Array<Book>>;
  constructor(private bookService: BookService, private checkboxService: CheckboxService) {}


  // tslint:disable-next-line:typedef
  ngOnInit() { // uruchamia sie jako 2 metoda tylko raz inicjalizuje dane w komponencie(lepiej ją uzywać niż konstruktor)
    /*this.bookService.getBooksFromBookService().subscribe((book) => {
      this.bookslist = book;
    });*/
    this.bookslist = this.bookService.getBooksFromBookService();
  }

  getColor(): string {
    // return this.bookslist.length >= 0 ? 'blue' : 'white';
    return 'blue';
  }
  // tslint:disable-next-line:typedef
  changeCheckboxList( checkboxOfBook: HTMLInputElement){    // checkboxOfBook: HTMLInputElement
    // tslint:disable-next-line:align
    if (checkboxOfBook.checked) {
      this.checkboxService.addToBooksMap(Number(checkboxOfBook.value));

    } else {
      this.checkboxService.removeFromBooksMap(Number(checkboxOfBook.value));
    }
  }

}
