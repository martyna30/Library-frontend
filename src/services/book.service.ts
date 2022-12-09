import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../app/models-interface/book';
import {HttpService} from './http.service';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Author} from '../app/models-interface/author';
import {BookTag} from '../app/models-interface/bookTag';
import {any} from 'codelyzer/util/function';
import {map, switchMap, tap} from 'rxjs/operators';
import {ListBook} from '../app/models-interface/listBook';
import {UserAuthService} from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookListObs$ = new BehaviorSubject<Array<Book>>([]);

  private totalCountBooks$ = new BehaviorSubject<number>(0);

  constructor(private httpService: HttpService, private userAuthService: UserAuthService) {
  this.getBooksFromBooksService();
  }


  // @ts-ignore
  getBookListObservable(page: any, size: number): Observable<Array<Book>> {
    this.httpService.getBooks(page, size).subscribe((listBook) => {
        this.bookListObs$.next(listBook.books);
        this.totalCountBooks$.next(listBook.total);
      });
  }

  getTotalCountBooks(): Observable<number> {
    return this.totalCountBooks$.asObservable();
  }

  getBooksFromBooksService(): Observable<Array<Book>> {
    return this.bookListObs$.asObservable();
  }

  saveBookToDB(book: Book): Observable<Book> {

    return this.httpService.saveBook(book);
 }
    // tslint:disable-next-line:typedef

  getBookById(id: number): Observable<Book> {
    return this.httpService.getBook(id);
  }

  // tslint:disable-next-line:typedef
  deleteBook(id: number): Observable<Book> {
    return this.httpService.deleteBook(id);
 }

 // @ts-ignore
  updateBook(book: Book): Observable<Book> {
    return this.httpService.updateBook(book);
  }

     // pipe(() => {
      /*return this.httpService.getBooks(page, pageSize).pipe(
        map((newList) => {
          this.bookListObs$.next(newList);
        }));
    });*/


  getBooksWithSpecifiedTitle(title: string): Observable<Array<Book>> {
    return this.httpService.getBooksWithSpecifiedTitle(title);
  }

  getBooksTagsWithSpecifiedCharacters(bookTag: string): Observable<Array<BookTag>> {
    return this.httpService.getBooksTagsWithSpecifiedCharacters(bookTag);
  }



}












