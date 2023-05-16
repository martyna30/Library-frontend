import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../app/models-interface/book';
import {HttpService} from './http.service';

import {BookTag} from '../app/models-interface/bookTag';

import {map, switchMap, tap} from 'rxjs/operators';

import {UserAuthService} from './user-auth.service';
import {Rental} from '../app/models-interface/rental';

import {BookDto} from '../app/models-interface/bookDto';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private bookListObs$ = new BehaviorSubject<Array<Book>>([]);

  private totalCountBooks$ = new BehaviorSubject<number>(0);

  borrowedBooks$ = new BehaviorSubject<Array<Rental>>([]);


  isBorrowed$ = new BehaviorSubject<boolean>(false);

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

  // tslint:disable-next-line:typedef
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


  getBooksWithSpecifiedTitle(title: string): Observable<Array<Book>> {
    return this.httpService.getBooksWithSpecifiedTitle(title);
  }

  getBooksTagsWithSpecifiedCharacters(bookTag: string): Observable<Array<BookTag>> {
    return this.httpService.getBooksTagsWithSpecifiedCharacters(bookTag);
  }

  checkOutBook(bookDto: BookDto, username: string): Observable<boolean> {
    return this.httpService.checkOutBook(bookDto, username)
      .pipe(
        map((response) => {
          this.isBorrowed$.next(true);
          return true;
        }));
  }

  // tslint:disable-next-line:typedef
  getRentalListForUser(username: string) {
    this.httpService.getRentalListForUser(username).subscribe((response) => {
          const rentals = response as Array<Rental>;
          this.borrowedBooks$.next(response);
          localStorage.setItem('borrowedBooks', rentals.toString());
    });
  }

  getRentalListObservable(): Observable<any>  {
    return this.borrowedBooks$.asObservable();
  }



}
























