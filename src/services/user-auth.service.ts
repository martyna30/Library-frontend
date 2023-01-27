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

  refreshtoken$ = new BehaviorSubject<string>(null);
  isloggedin$ = new BehaviorSubject<boolean>(false);
  userProfile$ = new BehaviorSubject<Array<string>>([]);

  userdata$ = new BehaviorSubject<UserDto>(null);
  userName$ = new BehaviorSubject<string>(null);
  userPassword$ = new BehaviorSubject<string>(null);
  jwtHelper = new JwtHelperService();

  constructor(private httpService: HttpService) {}

  getTokenFromService(): Observable<string> {
    const accesstoken = localStorage.getItem('access_token');
    const refreshtoken = localStorage.getItem('refresh_token');
    const newtoken = localStorage.getItem('new_token');
    // const username = localStorage.getItem('username');
    if (accesstoken !== null && accesstoken !== undefined) {

      const userdata = this.jwtHelper.decodeToken(accesstoken) as UserProfile;
      const userrole = userdata.role;
      this.userProfile$.next(userrole);
      const username = userdata.sub;
      this.token$.next(accesstoken);
      this.userName$.next(username);
      AuthTokenInterceptor.refresh = false;
      AuthTokenInterceptor.accessToken = accesstoken;
      // AuthTokenInterceptor.refreshToken = refreshtoken;
      this.isloggedin$.next(true);
      return this.token$.asObservable();
    }
    if ( refreshtoken !== null && refreshtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(refreshtoken) as UserProfile;
      const userrole = userdata.role;
      this.userProfile$.next(userrole);
      const username = userdata.sub;
      this.token$.next(refreshtoken);
      this.userName$.next(username);
      // AuthTokenInterceptor.accessToken = refreshtoken;
      AuthTokenInterceptor.refreshToken = refreshtoken;
      this.isloggedin$.next(true);
      return this.token$.asObservable();
    }
    if ( newtoken !== null && newtoken !== undefined) {
      const userdata = this.jwtHelper.decodeToken(newtoken) as UserProfile;
      const userrole = userdata.role;
      const username = userdata.sub;
      this.userProfile$.next(userrole);
      this.userName$.next(username);
      this.token$.next(newtoken);
      AuthTokenInterceptor.accessToken = newtoken;
      AuthTokenInterceptor.refresh = true;
      this.isloggedin$.next(true);
      return this.token$.asObservable();
    }
    else {
      console.log('Access denied, you have to log in');
    }
  }


  login(userDto: UserDto): Observable<any> {
    return this.httpService.generateToken(userDto)
      .pipe(
        map((response) => {
          this.isloggedin$.next(true);
          this.userName$.next(userDto.username);
          const tokens = response as Token;
          localStorage.setItem('username', userDto.username);
          localStorage.setItem('access_token', tokens.access_token);
          localStorage.setItem('refresh_token', tokens.refresh_token);
          AuthTokenInterceptor.accessToken = response.access_token;
          AuthTokenInterceptor.refreshToken = response.refresh_token;
          const userdata = this.jwtHelper.decodeToken(tokens.access_token) as UserProfile;
          const userrole = userdata.role;
          this.token$.next(tokens.access_token);
          this.userProfile$.next(userrole);
          return true;
        }));
  }
  register(user: NewUserDto): Observable<string> {
    return this.httpService.register(user);
  }

  logout() {
    return this.httpService.logout().subscribe(res => {
        this.userName$.next(null);
        this.token$.next(null);
        this.userProfile$.next(null);
        this.isloggedin$.next(false);
        localStorage.removeItem('new_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        localStorage.removeItem('borrowedBooks');
    });
  }


}

