import { Injectable } from '@angular/core';
import {HttpService} from './http.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {Rental} from '../app/models-interface/rental';
import {map} from 'rxjs/operators';
import {BookTag} from '../app/models-interface/bookTag';

@Injectable({
  providedIn: 'root'
})
export class BookTagsService {
  booksTags$ = new BehaviorSubject<Array<BookTag>>([]);

  constructor(private httpService: HttpService) { }

  getBooksTags(): Observable<Array<BookTag>> {
    return this.httpService.getBooksTags()
      .pipe(
        map((response) => {
      this.booksTags$.next(response);
      return this.booksTags$.getValue();
    }));
  }

  getBooksTagsFromService(): Observable<Array<BookTag>> {
    return this.booksTags$.asObservable();
  }
}
