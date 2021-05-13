import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Book} from '../app/models-interface/book';
import {Observable} from 'rxjs';
import {Author} from '../app/models-interface/author';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  readonly URL_DB = 'http://localhost:8080/v1/library/';
  // readonly param = new HttpParams()

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
  saveBook(book: Book) {
    this.http.post(this.URL_DB + 'createBook', book)
      .subscribe(requestBody => {
        console.log(requestBody);
      });
  }

  // tslint:disable-next-line:typedef
  saveAuthor(authors: Array<Author>) {
    this.http.post(this.URL_DB + 'createAuthor', authors)
      .subscribe(authors1 => {
        console.log(authors1);
    });
  }

  // tslint:disable-next-line:ban-types
  findAuthorsWithName(surname: string, forename: string): Observable<Author> {
    // @ts-ignore
    return this.http.get(this.URL_DB + 'findAuthorWithName');
  }

}
