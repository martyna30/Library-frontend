import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {Book} from '../app/models-interface/book';
import {ListBook} from '../app/models-interface/listBook';
import {BehaviorSubject, Observable, of, pipe, throwError} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {catchError, map, observeOn} from 'rxjs/operators';
import {AuthorService} from './author.service';
import {BookTag} from '../app/models-interface/bookTag';
import {ListAuthors} from '../app/models-interface/ListAuthors';
import {UserAuthService} from './user-auth.service';
import {Token} from '../app/models-interface/token';
import {error} from 'protractor';
import {UserProfile} from '../app/models-interface/user-profile';
import {JwtHelperService} from '@auth0/angular-jwt';
import {AuthTokenInterceptor} from '../app/interceptors/auth-token-interceptor';




@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/library/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private httpHeader2 = {headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};

  token$ = new BehaviorSubject<string | null>(null);
  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  isTokenExpired(accesstoken?): boolean {
    //  const accesstoken = localStorage.getItem('access_token');
    try {
      // tslint:disable-next-line:no-shadowed-variable
      const token = JSON.parse(atob(accesstoken.split('.')[1]));
      const exp = token.exp;
      const expired = (Date.now() >= exp * 1000);
      console.log(expired);
      console.log(token);
      return expired;
    } catch (e) {
      return null;
    }
  }

  getAccessToken() {
    const accesstoken = localStorage.getItem('access_token');
    /*if (accesstoken) {
     // const isTokenExpired = this.jwtHelper.isTokenExpired(accesstoken);
    //  if (isTokenExpired) {
      //  this.token$.next(null);
        return '';*/
    // const userData = this.jwtHelper.decodeToken(accesstoken) as UserProfile;
    // this.token$.next(accesstoken);  //tu usówam
    return accesstoken;
  }

  // tslint:disable-next-line:typedef
  getRefreshToken() {
    const refreshtoken = localStorage.getItem('refresh_token');
    return refreshtoken;
  }


  getTokenFromService() {
    return this.token$.getValue();
    console.log(this.token$.getValue());
  }

  getTokenObservable() {
    return this.token$.asObservable();
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

  getBooksWithSpecifiedTitle(title: string): Observable<Array<Book>> {
    // @ts-ignore
    const param = new HttpParams()
      .set('title', title + '');
    // const token = localStorage.getItem('access_token');

    return this.http.get<Array<Book>>(this.URL_DB + 'getBooksWithSpecifiedTitle', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, // Authorization: `Bearer ${token}`
      observe: 'body',
      params: param
    });
  }

  /*getBooksWithSpecifiedPublicationYear(yearOfPublication: number): Observable<Array<Book>> {
    const param = new HttpParams()
      .set('yearOfPublication', yearOfPublication + '');

    return this.http.get<Array<Book>>(this.URL_DB + 'getBooksWithSpecifiedPublicationYear', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      observe: 'body',
      params: param
    });
  }*/

  saveBook(book: Book): Observable<Book> {
    // const token = this.getTokenFromService();
    // const token = this.checkToken();
    return this.http.post<Book>(this.URL_DB + 'createBook', book, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  updateBook(book: Book): Observable<Book> {

    // const token = this.checkToken();
    // const token = this.getTokenFromService();
    return this.http.put<Book>(this.URL_DB + 'updateBook', book, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  deleteBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
    // const token = localStorage.getItem('access_token');


    return this.http.delete<Book>(this.URL_DB + 'deleteBook', {
      // headers: { Authorization: `Bearer ${token}`},
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, // Authorization: `Bearer ${token}`
      observe: 'body',
      params: param,
      responseType: 'json',

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

  getIdByName(forename: string, surname: string): Observable<number> {
    const param = new HttpParams()
      .set('forename', forename + '')
      .set('surname', surname + '');
    // const token = localStorage.getItem('access_token');

    return this.http.get<number>(this.URL_DB + 'findIdByName', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, // Authorization: `Bearer ${token}`
      observe: 'body',
      params: param
    });
  }

  getAuthorsForenameWithSpecifiedCharacters(forename: string): Observable<Array<Author>> {
    const param = new HttpParams()
      .set('forename', forename + '');
    const header1 = this.httpHeader;
    // const token = localStorage.getItem('access_token');

    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthorsForenameWithSpecifiedCharacters', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, //Authorization: `Bearer ${token}`
      observe: 'body',
      params: param
    });
  }

  getAuthorsSurnameWithSpecifiedCharacters(surname: string): Observable<Array<Author>> {
    const param = new HttpParams()
      .set('surname', surname + '');
    const header1 = this.httpHeader;
    //  const token = localStorage.getItem('access_token');

    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthorsSurnameWithSpecifiedCharacters', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, //Authorization: `Bearer ${token}`
      observe: 'body',
      params: param
    });
  }

  saveAuthor(author: Author): Observable<Author> {
    const token = localStorage.getItem('access_token');

    return this.http.post<Author>(this.URL_DB + 'createAuthor', author, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
    });
  }

  updateAuthor(author: Author): Observable<Author> {
    const token = localStorage.getItem('access_token');

    return this.http.put<Author>(this.URL_DB + 'updateAuthor', author, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
    });
  }

  deleteAuthor(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('authorId', id + '');
    const token = localStorage.getItem('access_token');


    return this.http.delete<Book>(this.URL_DB + 'deleteAuthor', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      observe: 'body',
      params: param,
      responseType: 'json',
    });
  }

  getBooksTagsWithSpecifiedCharacters(bookTag: string): Observable<Array<BookTag>> {
    const param = new HttpParams()
      .set('bookTag', bookTag + '');
    const token = localStorage.getItem('access_token');
    return this.http.get<Array<BookTag>>(this.URL_DB + 'getBooksTagsWithSpecifiedCharacters', { //  // Authorization: `Bearer ${token}`
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param
    });
  }

  generateToken(username: string, password: string) {
    const param = new HttpParams()
      .set('username', username + '')
      .set('password', password + '');
    return this.http.post<Token>(this.URL_DB + 'login', param, {
      responseType: 'json',
      observe: 'body'
    }).pipe(
      map((response) => {
        localStorage.clear();
        const tokens = response as Token;
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
          // this.token$.next(tokens.access_token);
        AuthTokenInterceptor.accessToken = response.access_token;
        AuthTokenInterceptor.refreshToken = response.refresh_token;
        return true;
      }),
      catchError(errors => {
        console.log(errors);
        return of(false);
      })
    );
  }

  // tslint:disable-next-line:typedef
  refreshToken(payload) {
    // @ts-ignore
    return this.http.post<Token>(this.URL_DB + 'token/refresh', payload, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json', Authorization: `Bearer ${payload}`},
      responseType: 'json',
      observe: 'body'
    });
    /*.pipe(
    map((response) => {
        // const newtoken = response as Token;
        // console.log(response);
        localStorage.setItem('access_token', newtoken.access_token);
        this.token$.next(newtoken.access_token);
        // AuthTokenInterceptor.newToken = response.access_token;
        return true;
        }),
    catchError(errors => {
    console.log(errors);
    return of(false);
    })
  );*/
  }
}
























