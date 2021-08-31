import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../app/models-interface/book';
import {HttpService} from './http.service';
import {HttpParams} from '@angular/common/http';
import {Author} from '../app/models-interface/author';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private bookListObs = new BehaviorSubject<Array<Book>>([]);



  constructor(private httpService: HttpService) {
    this.httpService.getBooks().subscribe(books => {
      this.bookListObs.next(books);
    });

  }
  getBooksFromService(): Observable<Array<Book>>   {
    return this.bookListObs.asObservable();
  }

  // tslint:disable-next-line:typedef
  addBook(book: Book) {
    const list = this.bookListObs.getValue();
    list.push(book);
    this.bookListObs.next(list); // emituje liste z nową książką
  }

  // tslint:disable-next-line:typedef

  // tslint:disable-next-line:typedef
  saveBookToDB(book: Book): Observable<Book> {
    return this.httpService.saveBook(book);
  }
  // tslint:disable-next-line:typedef
  getBookListObservable(): Observable<Array<Book>> {
    return this.httpService.getBooks();
  }

  getBookById(id: number): Observable<Book> {
    return this.httpService.getBook(id);
  }

  // @ts-ignore
  deleteBook(id: number): void  {
    this.httpService.deleteBook(id).subscribe(() => {
      this.getBookListObservable().subscribe((newList) => {
        this.bookListObs.next(newList);
      });
    });

    // const list = this.bookListObs.getValue();
    // tslint:disable-next-line:no-shadowed-variable
    // const listAfterDelete = list.filter(listBook => listBook.id !== id);
   // this.bookListObs.next(listAfterDelete);
  }
  // tslint:disable-next-line:typedef
  removeBookFromList(id: number) {
    const list = this.bookListObs.getValue().filter(book => book.id !== id);
    // const list = this.bookListObs.getValue().map(b => b.id).filter(bookId => bookId !== id);
    // @ts-ignore
    this.bookListObs.next(list);
  }







}
