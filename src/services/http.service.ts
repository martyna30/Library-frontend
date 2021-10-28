import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Book} from '../app/models-interface/book';
import {Observable, throwError} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {observeOn} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/library/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private httpHeader2 = {headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};


  constructor(private http: HttpClient) {
    this.getBooks();
    this.getAuthors();
  }

  getBooks(): Observable<Array<Book>> {
    return this.http.get<Array<Book>>(this.URL_DB + 'getBooks');
  }

  getAuthors(): Observable<Array<Author>> {
    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthors');
  }


  // tslint:disable-next-line:typedef
  saveBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.URL_DB + 'createBook', book);
  }

  saveAuthor(author: Author): Observable<Author> {
    return this.http.post<Author>(this.URL_DB + 'createAuthor', author);
  }

  getIdByName(forename: string, surname: string): Observable<number> {
    const param = new HttpParams()
      .set('forename', forename + '')
      .set('surname', surname + '');
    const httpHeaders = this.httpHeader;
    // @ts-ignore

    return this.http.get<number>(this.URL_DB + 'findIdByName', {
      observe: 'response',
      header: httpHeaders,
      params: param
    });
  }

  deleteBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
    return this.http.delete<Book>(this.URL_DB + 'deleteBook', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(this.URL_DB + 'updateBook', book);
  }

  getBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
    const httpHeaders = this.httpHeader;
    // @ts-ignore

    return this.http.get<Book>(this.URL_DB + 'getBook', {
      observe: 'body',
      header: httpHeaders,
      params: param
    });
  }

  getAuthor(id: number): Observable<Author> {
    const param = new HttpParams()
      .set('authorId', id + '');
    const httpHeaders = this.httpHeader;
    // @ts-ignore
    return this.http.get<Author>(this.URL_DB + 'getAuthor', {
      observe: 'body',
      header: httpHeaders,
      params: param
    });
  }

  updateAuthor(author: Author): Observable<Author> {
    return this.http.put<Author>(this.URL_DB + 'updateAuthor', author);
  }

  getBooksWithSpecifiedTitle(title: string): Observable<Array<Book>> {
    // @ts-ignore
    const param = new HttpParams()
      .set('title', title + '');
    return this.http.get<Array<Book>>(this.URL_DB + 'getBooksWithSpecifiedTitle', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }
}










