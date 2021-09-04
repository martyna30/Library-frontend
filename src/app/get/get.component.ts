import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../models-interface/book';
import {Author} from '../models-interface/author';
import {BookTag} from '../models-interface/bookTag';
import {CheckboxService} from '../../services/checkbox.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.css']
})
export class GetComponent implements OnInit {
  ngOnInit(): void {
  }

  /*bookslist: Array<Book> = []; // przyjmuje książki i wyswietla je
  bookId: string;



  constructor(private bookService: BookService, private checkboxService: CheckboxService) {
    // tslint:disable-next-line:new-parens
    this.bookService.getBooksFromService().subscribe(((book) => {
     this.bookslist = book;
    }));
   /* this.bookService.getBookListObservable().subscribe((books) => {
      this.bookslist = books;
    //});
    */
  /*}

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
  }*/
}

