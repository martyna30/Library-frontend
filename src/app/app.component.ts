import { Component } from '@angular/core';
import {HttpService} from '../services/http.service';
import {BookService} from '../services/book.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // title = 'listOfbooks';
  errorMessage: string;

  constructor(private bookService: BookService) {}
  // tslint:disable-next-line:typedef
  /*saveBookToDB() {
    this.bookService.saveBookToDB();
  }*/
  // tslint:disable-next-line:typedef
  getBookFromDB() {
    this.bookService.getBookListObservable();
  }


}







