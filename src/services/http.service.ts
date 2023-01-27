import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
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
import {UserDto} from '../app/models-interface/userDto';
import {NewUserDto} from '../app/models-interface/newUserDto';
import {ObjectName} from '../app/models-interface/ObjectName';
import {Rental} from '../app/models-interface/rental';
import {RentalBookDto} from '../app/models-interface/rentalBookDto';
import {BookDto} from '../app/models-interface/bookDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private URL_DB = 'http://localhost:8080/v1/library/';
  private httpHeader = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
  private httpHeader2 = {headers2: new HttpHeaders({'Access-Control-Allow-Origin': '*'})};


  constructor(private http: HttpClient) {
  }


  /*getTokenFromService(): Observable<string> {
    const accesstoken = localStorage.getItem('access_token');
    const newtoken = localStorage.getItem('new_token');
    if (accesstoken !== null && accesstoken !== undefined
      || newtoken !== null && newtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(accesstoken || newtoken) as UserProfile;
      const userrole = userdata.role;
      this.userProfile$.next(userrole);
      this.token$.next(accesstoken || newtoken);
      this.isloggedin$.next(true);
      return this.token$.asObservable();
    }
    else {
      console.log('Access denied, you have to log in');
    }
  }*/

  isTokenExpired(accesstoke?): boolean {
     const accesstoken = localStorage.getItem('access_token');
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
    return this.http.get<Array<Book>>(this.URL_DB + 'getBooksWithSpecifiedTitle', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param
    });
  }


  getObjectsWithSpecifiedTitleOrAuthor(objectToSearch: string): Observable<Array<ObjectName>> {
    const param = new HttpParams()
      .set('objectToSearch', objectToSearch + '');
    return this.http.get<Array<ObjectName>>(this.URL_DB + 'getObjectsWithSpecifiedTitleOrAuthor', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
      observe: 'body',
      params: param
    });
  }

  saveBook(book: Book): Observable<Book> {
    // const token = this.getTokenFromService();
    // const token = this.checkToken();
    return this.http.post<Book>(this.URL_DB + 'createBook', book, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  updateBook(book: Book): Observable<Book> {
    return this.http.put<Book>(this.URL_DB + 'updateBook', book, {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    });
  }

  deleteBook(id: number): Observable<Book> {
    const param = new HttpParams()
      .set('bookId', id + '');
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
    return this.http.get<Array<Author>>(this.URL_DB + 'getAuthorsSurnameWithSpecifiedCharacters', {
      headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}, // Authorization: `Bearer ${token}`
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

  generateToken(userDto: UserDto) {
    const param = new HttpParams()
      .set('username', userDto.username + '')
      .set('password', userDto.password + '');
    return this.http.post<Token>(this.URL_DB + 'login', userDto, {
      responseType: 'json',
      observe: 'body',
      params: param
    });
  }
   logout() {
     return this.http.post('http://localhost:8080/v1/library/logout', {}, {});
   }
  register(user: NewUserDto): Observable<string> {
    return this.http.post(this.URL_DB + 'register', user, {
      responseType: 'text',
      observe: 'body'
    });
  }

  getRentalListForUser(username: string): Observable<Array<Rental>> {
    const param = new HttpParams()
      .set('username',  username + '');
    return this.http.get<Array<Rental>>(this.URL_DB + 'rental/getRentalsForUser',  {
      headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
      observe: 'body',
      params: param
    });
  }

  checkOutBook(bookDto: BookDto, username: string): Observable<boolean> {
    const param = new HttpParams()
      // .set('bookId', bookId + '')
      .set('username', username + '');
    // @ts-ignore
    return this.http.put<boolean>(this.URL_DB + 'rental/checkoutBook', bookDto, {
      observe: 'body',
      header: HttpHeaders,
      responseType: 'json',
      params: param
    });
  }





}


























