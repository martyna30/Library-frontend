import {Injectable, Input, Optional, Output} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {HttpService} from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private foundAuthorWithName = new BehaviorSubject<Author>(null);

  /*constructor(private httpService: HttpService, surname: string, forename: string) {
    this.httpService.findAuthorsWithName(surname, forename).subscribe( authorInput => {
      this.foundAuthorWithName.next(authorInput);
    });
  }*/
  constructor(private httpService: HttpService) {
  }

  findAuthorWithName(): Observable<Author> {
    return this.foundAuthorWithName.asObservable();
  }

  // @ts-ignore
  /*/addAuthor(author: Author): void {
    const list = this.authorListObs.getValue();

    if (!list.includes(author)) {
      list.push(author);
      this.saveAuthorToDB();
    }
    this.authorListObs.next(list);
  }
    // tslint:disable-next-line:typedef
  saveAuthorToDB() {
    this.httpService.saveAuthor(this.authorListObs.getValue());
  }*/
}




