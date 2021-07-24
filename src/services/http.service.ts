import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Book} from '../app/models-interface/book';
import {Observable, throwError} from 'rxjs';
import {Author} from '../app/models-interface/author';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/library/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

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
      // .set('Content-Type', 'application/json')
      // .set('charset', 'utf-8');

    // .set('Authorization', 'Basic QWxhZGRpb');
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
  }







