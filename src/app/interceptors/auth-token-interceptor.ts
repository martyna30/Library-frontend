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


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, private http: HttpClient, private userAuthService: UserAuthService,
              private jwtHelper: JwtHelperService) {
  }

  static accessToken = '';
  static refreshToken = '';

  private islogout = false;
  refresh = false;
  // tslint:disable-next-line:typedef
  intercept(request, next) {
    /*if (request.url.indexOf('login') > -1 || request.url.indexOf('token/refresh') > -1) {
      return next.handle(request);
    }*/

    // const acesstoken = this.httpService.token$.getValue();

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
      }
    });

    return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        if ((err.status === 403 || err.status === 401) && !this.refresh) {
          this.refresh = true;
          AuthTokenInterceptor.accessToken = AuthTokenInterceptor.refreshToken;
          // const http = this.injector.get(HttpClient);
          return this.http.post('http://localhost:8080/v1/library/token/refresh', {}, {}).pipe(
            switchMap((res: any) => {
              const newtoken = res as Token;
              AuthTokenInterceptor.accessToken = newtoken.access_token;
              localStorage.clear();
              localStorage.setItem('new_token', newtoken.access_token);
              this.userAuthService.token$.next(newtoken.access_token);
              const userdata = this.jwtHelper.decodeToken(newtoken.access_token) as UserProfile;
              const userrole = userdata.role;
              this.userAuthService.userProfile$.next(userrole);
              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
                }
              }));
            })
          );
        }
        if (!this.islogout && (err.status === 403 || err.status === 401) && this.refresh === true) {
          this.islogout = true;   // !this.islogout && AuthTokenInterceptor.accessToken !== null
          AuthTokenInterceptor.accessToken = '';
          // const userAuthService = this.injector.get(UserAuthService);  //tu zminiam
          return this.userAuthService.logout();
        }
        if (err.status === 422 && !this.islogout) {
          return next.handle(req);
        }

        if (err.status === 403 && this.islogout) {
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

