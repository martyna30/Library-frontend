import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {HttpService} from './http.service';

import {Book} from '../app/models-interface/book';
import {Author} from '../app/models-interface/author';
import {BookTag} from '../app/models-interface/bookTag';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {error} from 'protractor';
import {decode} from 'querystring';
import {NewUserDto} from '../app/models-interface/newUserDto';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserProfile} from '../app/models-interface/user-profile';
import {UserDto} from '../app/models-interface/userDto';
import {Token} from '../app/models-interface/token';
import {map} from 'rxjs/operators';
import {AuthTokenInterceptor} from '../app/interceptors/auth-token-interceptor';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {


  token$ = new BehaviorSubject<string>(null);
  isloggedin$ = new BehaviorSubject<boolean>(false);
  userProfile$ = new BehaviorSubject<Array<string>>([]);
  loggedInUsername$ = new BehaviorSubject<string>('');
  jwtHelper = new JwtHelperService();

  constructor(private httpService: HttpService) {}

  getTokenFromService(): Observable<string> {
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
  }
  // @ts-ignore
  login(userDto: UserDto): Observable<any> {
    return this.httpService.generateToken(userDto)
      .pipe(
        map((response) => {
          localStorage.clear();
          const tokens = response as Token;
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          this.token$.next(tokens.access_token);
          this.isloggedin$.next(true);
          this.loggedInUsername$.next(userDto.username);
          const userdata = this.jwtHelper.decodeToken(tokens.access_token) as UserProfile;
          const userrole = userdata.role;
          this.userProfile$.next(userrole);
          AuthTokenInterceptor.accessToken = response.access_token;
          AuthTokenInterceptor.refreshToken = response.refresh_token;
          return true;
        }));
  }
  register(user: NewUserDto): Observable<string> {
    return this.httpService.register(user);
  }

  logout() {
    return this.httpService.logout()
      .subscribe(res => {
        this.token$.next(null);
        this.isloggedin$.next(false);
        this.userProfile$.next(null);
        localStorage.clear();
      });
  }

}

