import { Component, OnInit } from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../models-interface/book';

@Component({
  selector: 'app-get',
  templateUrl: './get.component.html',
  styleUrls: ['./get.component.css']
})
export class GetComponent implements OnInit {

  bookslist: Array<Book> = []; // przyjmuje książki i wyswietla je


  constructor(private bookService: BookService) {
    this.bookService.getBookListObservable().subscribe( (books: Array<Book>)  => {
      this.bookslist = books;
    });
  }

  ngOnInit(): void {
  }

  getColor(): string {
    // return this.bookslist.length >= 0 ? 'blue' : 'white';
    return 'blue';
  }
}
