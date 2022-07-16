import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Book} from '../app/models-interface/book';
import {ListBook} from '../app/models-interface/listBook';
import {Observable, throwError} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {observeOn} from 'rxjs/operators';
import {AuthorService} from './author.service';
import {BookTag} from '../app/models-interface/bookTag';
import {ListAuthors} from '../app/models-interface/ListAuthors';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/library/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private httpHeader2 = {headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};

  constructor(private http: HttpClient) {
  }

  getBooks(page: number, size: number): Observable<ListBook> {
    const param = new HttpParams()
      .set('page', page + '')
      .set('size', size + '');
    return this.http.get<ListBook>(this.URL_DB + 'getBooks', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }


  getAuthors(page: number, size: number): Observable<ListAuthors> {
    const param = new HttpParams()
      .set('page', page + '')
      .set('size', size + '');
    return this.http.get<ListAuthors>(this.URL_DB + 'getAuthors', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
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

  getAuthorsForenameWithSpecifiedCharacters(forename: string): Observable<Array<Author>> {
    const param = new HttpParams()
      .set('forename', forename + '');
    const header1 = this.httpHeader;
    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthorsForenameWithSpecifiedCharacters', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }

  getAuthorsSurnameWithSpecifiedCharacters(surname: string): Observable<Array<Author>> {
    const param = new HttpParams()
      .set('surname', surname + '');
    const header1 = this.httpHeader;
    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthorsSurnameWithSpecifiedCharacters', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }


  getBooksTagsWithSpecifiedCharacters(bookTag: string): Observable<Array<BookTag>> {
    const param = new HttpParams()
      .set('bookTag', bookTag + '');
    return this.http.get<Array<BookTag>>(this.URL_DB + 'getBooksTagsWithSpecifiedCharacters', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }

  getBooksWithSpecifiedPublicationYear(yearOfPublication: number): Observable<Array<Book>> {
    const param = new HttpParams()
      .set('yearOfPublication', yearOfPublication + '');
    return this.http.get<Array<Book>>(this.URL_DB + 'getBooksWithSpecifiedPublicationYear', {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }


  // tslint:disable-next-line:typedef
  // @ts-ignore
  generateToken(username: string, password: string): Observable<string> {
    const param = new HttpParams()
      .set('username', username + '')
      .set('password', password + '');
    //localStorage.getItem('acess_token', '');
    return this.http.post<string>('http://localhost:8080/v1/library/login', param, {
      responseType: 'text' as 'json',
      //headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Access-Control-Allow-Origin': '*' },
      observe: 'body'
    });
  }

}





/*post(url: string, body: any | null, options: {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
};
  observe?: 'body';
  params?: HttpParams | {
    [param: string]: string | string[];
};
  reportProgress?: boolean;
  responseType: 'text';
  withCredentials?: boolean;
}): Observable<string>;
*/







