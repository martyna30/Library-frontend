import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {Author} from '../app/models-interface/author';
import {HttpService} from './http.service';
import {User} from '../app/models-interface/user';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  private userTokenObs$ = new BehaviorSubject<string>('');

  constructor(private httpService: HttpService) {}

  // @ts-ignore
  login(username: string, password: string): Observable<string> {
   return  this.httpService.generateToken(username, password); //.subscribe((token) => {
      // this.userTokenObs$.next(token);
   // });
  }

  /*getTokenFromService(): Observable<string> {
    return this.userTokenObs$.asObservable();
  }*/
}
