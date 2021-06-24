import {Injectable, Input, Optional, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {HttpService} from './http.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private httpService: HttpService) {}

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

  }





