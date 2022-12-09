import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {HttpService} from './http.service';

import {Book} from '../app/models-interface/book';
import {Author} from '../app/models-interface/author';
import {BookTag} from '../app/models-interface/bookTag';
import {HttpErrorResponse} from '@angular/common/http';
import {error} from 'protractor';
import {decode} from 'querystring';
import {NewUserDto} from '../app/models-interface/newUserDto';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {


  // private token$ = new BehaviorSubject<any>(null);

  constructor(private httpService: HttpService) {}

  // @ts-ignore
  /*login(username: string, password: string): Observable<string> {
    return this.httpService.generateToken(username, password); /*subscribe((res) => {
      const tokenRes = res.substring(17, 255);
      const token = tokenRes.replace('"', '').replace('}', '');
      this.token$.next(localStorage.setItem('acess_token', token));
      // this.token$.next(localStorage.setItem('refresh_token', token));
    }, response => {
      console.log(response);
    });*/
  // tslint:disable-next-line:typedef
  register(user: NewUserDto): Observable<string> {
    return this.httpService.register(user);
  }
}

