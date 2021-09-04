import {Component, OnInit} from '@angular/core';
import {HttpService} from '../services/http.service';
import {BookService} from '../services/book.service';
import {Book} from './models-interface/book';
import {CheckboxService} from '../services/checkbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'library-frontend';
  errorMessage: string;

  // constructor(private bookService: BookService) {}
  // tslint:disable-next-line:typedef
  /*saveBookToDB() {
    this.bookService.saveBookToDB();
  }*/
  // tslint:disable-next-line:typedef
  // () {
   // this.bookService.getBookListObservable();
  // }

  bookslist: Array<Book> = []; // przyjmuje książki i wyswietla je
  bookId: string;



  constructor(private bookService: BookService, private checkboxService: CheckboxService) {
    // tslint:disable-next-line:new-parens
    /*this.bookService.getBooksFromService().subscribe(((book) => {
      this.bookslist = book;
    }));*/
  }
  // tslint:disable-next-line:typedef
  ngOnInit() { // uruchamia sie jako 2 metoda tylko raz inicjalizuje dane w komponencie(lepiej ją uzywać niż konstruktor)
    this.bookService.getBooksFromService().subscribe(((book) => {
      this.bookslist = book;
    }));
  }
  getColor(): string {
    // return this.bookslist.length >= 0 ? 'blue' : 'white';
    return 'blue';
  }
  // tslint:disable-next-line:typedef
  changeCheckboxList( checkboxOfBook: HTMLInputElement){    // checkboxOfBook: HTMLInputElement
    // tslint:disable-next-line:align
    if (checkboxOfBook.checked) {
      this.checkboxService.add(Number(checkboxOfBook.value));
    } else {
      this.checkboxService.remove(Number(checkboxOfBook.value));
    }
  }
}










