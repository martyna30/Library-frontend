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
      // .subscribe(requestBody => {
       //  console.log(requestBody);
      // }, err => (
       // console.log(err)
       // ));
  }


  // tslint:disable-next-line:typedef
  saveAuthor(authors: Array<Author>) {
    this.http.post(this.URL_DB + 'createAuthor', authors)
      .subscribe(authors1 => {
        console.log(authors1);
    });
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
    }); // catchError(this.handleError);
  }

    // tslint:disable-next-line:typedef
    /*private handleError(error: HttpErrorResponse) {
      console.error(
        'Name: $ {error.name} \n' +
        'Message: ${ error.message} \n' +
        'Returned code: ${error.status}\n'
      );
      return throwError('');
    }*/
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
    // tslint:disable-next-line:typedef
  deleteBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
    return this.http.delete<Book>(this.URL_DB + 'deleteBook', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } ,
      observe: 'body',
      params: param
    });
  }

  updateBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
    return this.http.put<Book>(this.URL_DB + 'updateBook', {
      observe: 'body',
      params: param
    });
  }
}








