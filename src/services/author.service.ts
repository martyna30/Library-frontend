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

  private authorsListObs$ = new BehaviorSubject<Array<Author>>([]);

  // private allAuthorsListObs$ = new BehaviorSubject<Array<Author>>([]);

  private totalCountAuthors$ = new BehaviorSubject<number>(0);

  constructor(private httpService: HttpService) {
    this.getAuthorsFromAuthorsService();
  }

  getAuthorsListObservable(page: any, size: number): Observable<Array<Author>> {
    this.httpService.getAuthors(page, size).subscribe((listAuthors) => {
      this.authorsListObs$.next(listAuthors.authors);
      this.totalCountAuthors$.next(listAuthors.total);
    });
    return;
  }

  /*getAllAuthorsListObservable(): Observable<Array<Author>> {
    this.httpService.getAllAuthors().subscribe((authors) => {
     this.allAuthorsListObs$.next(authors);
    });
    return;
  }*/

  getTotalCountOfAuthors(): Observable<number> {
    return this.totalCountAuthors$.asObservable();
  }

  getIdByName(forename, surname): Observable<number> {
    return this.httpService.getIdByName(forename, surname);
  }


  getAuthorsFromAuthorsService(): Observable<Array<Author>> {
    return this.authorsListObs$.asObservable();
  }

  /*getAllAuthorsFromAuthorsService(): Observable<Array<Author>> {
    return this.allAuthorsListObs$.asObservable();
  }*/


  saveAuthor(author: Author): Observable<Author> {
    return this.httpService.saveAuthor(author);
  }

  // @ts-ignore
  getAuthorById(id: number): Observable<Author> {
    return this.httpService.getAuthor(id);

  }
  // @ts-ignore
  updateAuthor(author: Author): Observable<Author> {
    return this.httpService.updateAuthor(author);
  }
  // tslint:disable-next-line:typedef
  getAuthorsForenameWithSpecifiedCharacters(forename: string) {
    return this.httpService.getAuthorsForenameWithSpecifiedCharacters(forename);
  }
  // tslint:disable-next-line:typedef
  getAuthorsSurnameWithSpecifiedCharacters(surname: string) {
    return this.httpService.getAuthorsSurnameWithSpecifiedCharacters(surname);
  }

  // tslint:disable-next-line:typedef
  deleteAuthor(authorId: number) {
    return this.httpService.deleteAuthor(authorId);
  }
}








