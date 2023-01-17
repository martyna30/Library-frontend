import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {EventEmitter, Injectable, Injector, Input, Output} from '@angular/core';
import {Token} from '../models-interface/token';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpService} from '../../services/http.service';
import {Router} from '@angular/router';
import {UserProfile} from '../models-interface/user-profile';
import {JwtHelperService} from '@auth0/angular-jwt';
import {UserAuthService} from '../../services/user-auth.service';
import {A} from '@angular/cdk/keycodes';
import {getToken} from 'codelyzer/angular/styles/cssLexer';
import {UserDto} from '../models-interface/userDto';


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private http: HttpClient, private userAuthService: UserAuthService,
              private jwtHelper: JwtHelperService) {
  }


  static accessToken = '';
  static refreshToken = '';

  static userdata: UserDto;

  static refresh = false;

  private islogout = false;


  // tslint:disable-next-line:typedef
  intercept(request, next) {
    // if (request.url.indexOf('login') > -1 || request.url.indexOf('token/refresh') > -1) {
    // return next.handle(request);
    // }
    // let atoken;
   // if (AuthTokenInterceptor.accessToken === null || AuthTokenInterceptor === undefined) {
     //  atoken = this.userAuthService.getTokenFromService();
   // }

      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
        }
      });

      return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        if ((err.status === 403 || err.status === 401) && !AuthTokenInterceptor.refresh) {
          // const refreshtoken = localStorage.getItem('tokens');
          // this.userAuthService.token$.subscribe(token => {
          // AuthTokenInterceptor.refreshToken = token;
          // });
          AuthTokenInterceptor.accessToken = AuthTokenInterceptor.refreshToken;
          this.userAuthService.token$.next(AuthTokenInterceptor.refreshToken);
          // const userdata = this.jwtHelper.decodeToken(AuthTokenInterceptor.refreshToken) as UserProfile;
         //  const userrole = userdata.role;
          // this.userAuthService.userProfile$.next(userrole);
          localStorage.removeItem('access_token');
          // const http = this.injector.get(HttpClient);
          return this.http.post('http://localhost:8080/v1/library/token/refresh', {}, {}).pipe(
            switchMap((res: any) => {
              const newtoken = res as Token;
              AuthTokenInterceptor.refresh = true;
              AuthTokenInterceptor.accessToken = newtoken.access_token;
              localStorage.setItem('new_token', newtoken.access_token);
              this.userAuthService.token$.next(newtoken.access_token);
              localStorage.removeItem('refresh_token');
              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
                }
              }));
            })
          );
        }
        if (!this.islogout && (err.status === 403 || err.status === 401) && AuthTokenInterceptor.refresh === true) {
          this.islogout = true;
          this.userAuthService.isloggedin$.next(false);
          AuthTokenInterceptor.accessToken = '';
          localStorage.removeItem('new_token');
          return this.userAuthService.logout();
        }
        if (err.status === 422 && !this.islogout) {
          return next.handle(req);
        }

        if ( (err.status === 403 || err.status === 401) && this.islogout === true) {
          return next.handle(req);
        }

        if (err.status === 201) {
          return next.handle(req);
        }
        // this.refresh = false;
        return throwError(() => err);
      }));
    }
  }


