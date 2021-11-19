import {Injectable, Input, OnInit, Optional, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {HttpService} from './http.service';
import {HttpParams} from '@angular/common/http';
import {Book} from '../app/models-interface/book';

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private authorsListObs = new BehaviorSubject<Array<Author>>([]);

  constructor(private httpService: HttpService) {
    this.httpService.getAuthors().subscribe((authors) => {
      this.authorsListObs.next(authors);
    });
  }

  getAuthorsListObservable(): Observable<Array<Author>> {
    return this.httpService.getAuthors();
  }

  getIdByName(forename, surname): Observable<number> {
    return this.httpService.getIdByName(forename, surname);
  }

  /*
    addAuthorToObservable(author: Author): void {
    const authorToDB = this.authorToDB.getValue();
    authorToDB.push(author);
    this.authorToDB.next(authorToDB);
    }

    getAuthorWithName() {
      // tslint:disable-next-line:no-shadowed-variable
      const authorForename = this.authorToDB.getValue().map(author => author.forename);
      // tslint:disable-next-line:no-shadowed-variable
      const authorSurname = this.authorToDB.getValue().map(author => author.surname);

      this.httpService.findAuthorsWithName(authorForename, authorSurname);
    }*/

  /*saveAuthorToDB() {
    this.httpService.saveAuthor(this.authorListObs.getValue());
  }*/

  // @ts-ignore
  getAuthorsFromAuthorsService(): Observable<Array<Author>> {
    return this.authorsListObs.asObservable();
  }

  geAuthorsListObservable(): Observable<Array<Author>> {
    return this.httpService.getAuthors();
  }

  // tslint:disable-next-line:typedef
  addAuthor(author: Author) {
    const authorsList = this.authorsListObs.getValue();
    authorsList.push(author);
    this.authorsListObs.next(authorsList);
  }

  saveAuthor(author: Author): Observable<Author> {
    return this.httpService.saveAuthor(author);
  }

  // @ts-ignore
  getAuthorById(id: number): Observable<Author> {
    return this.httpService.getAuthor(id);

  }
  // @ts-ignore
  updateAuthor(author: Author): Observable<Author> {
    this.httpService.updateAuthor(author).subscribe(() => {
      this.getAuthorsListObservable().subscribe((newList) => {
        this.authorsListObs.next(newList);
      });
    });
  }
  // tslint:disable-next-line:typedef
  getAuthorsForenameWithSpecifiedCharacters(forename: string) {
    return this.httpService.getAuthorsForenameWithSpecifiedCharacters(forename);
  }
  // tslint:disable-next-line:typedef
  getAuthorsSurnameWithSpecifiedCharacters(surname: string) {
    return this.httpService.getAuthorsSurnameWithSpecifiedCharacters(surname);
  }
}








