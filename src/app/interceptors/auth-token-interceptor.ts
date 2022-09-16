import {HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, Injector } from '@angular/core';
import {Token} from '../models-interface/token';
import {Observable, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpService} from '../../services/http.service';


@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private http: HttpClient) {
  }

  static accessToken = '';
  static refreshToken = '';
  refresh = false;

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  // tslint:disable-next-line:typedef
  intercept(request, next) {
    // if (request.url.indexOf('login') > -1 || request.url.indexOf('refreshToken') > -1) {

      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
        }
      });
      /*this.httpService.token$.next(null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.httpService = this.injector.get(HttpService);
         const accessToken = AuthTokenInterceptor.accessToken;
      const refreshToken = AuthTokenInterceptor.refreshToken;
      const isAccessTokenExpired = this.httpService.isTokenExpired(accessToken);
      const isRefreshTokenExpired = this.httpService.isTokenExpired(refreshToken);
    if(AuthTokenInterceptor.accessToken !== null && AuthTokenInterceptor.refreshToken !== null
    && isAccessTokenExpired && !isRefreshTokenExpired )*/
    /*const refreshreq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${AuthTokenInterceptor.refreshToken}`
      }});*/
      return next.handle(req).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 403 && !this.refresh) {
          this.refresh = true;
          AuthTokenInterceptor.accessToken = AuthTokenInterceptor.refreshToken;
          // const http = this.injector.get(HttpClient);
          return this.http.post('http://localhost:8080/v1/library/token/refresh', {}, {}).pipe(
            switchMap((res: any) => {
              const newtoken = res as Token;
              AuthTokenInterceptor.accessToken = newtoken.access_token;

              return next.handle(request.clone({
                setHeaders: {
                  Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
                }
              }));
            })
          );
        }
        this.refresh = false;
        return throwError(() => err);
      }));
    }
  }

// (catchError((err: HttpErrorResponse) =>


/*this.httpService = this.injector.get(HttpService);
const accessToken = this.httpService.getAccessToken();  // zmien na getTokenFromSrvice
const refreshToken = this.httpService.getRefreshToken();
// const accessToken =  this.httpService.token$.getValue();
const isAccessTokenExpired = this.httpService.isTokenExpired(accessToken);
const isRefreshTokenExpired = this.httpService.isTokenExpired(refreshToken);
if (accessToken != null && !isAccessTokenExpired) {
return next.handle(req);
else if (refreshToken != null && !isRefreshTokenExpired) {
this.httpService.token$.next(null);
// localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
const payload = refreshToken as Token;
return next.handle(request).pipe(catchError(err => {
  if (err.status === 401) {
    this.httpService = this.injector.get(HttpService);
    return this.httpService.refreshToken(AuthTokenInterceptor.refreshToken).pipe(
      map(res => {
        const newtoken = res as Token;
        AuthTokenInterceptor.accessToken = newtoken.access_token;

        const transformRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${AuthTokenInterceptor.accessToken}`
          }
        });
        return next.handle(transformRequest);
      })
    );
  }
  return throwError(() => err);
}));
}
}
}*/







// poprzed
/*intercept(req, next){
if (req.url.indexOf('login') > -1 || req.url.indexOf('refreshToken') > -1) {
return next.handle(req);
}
this.httpService = this.injector.get(HttpService);
const accessToken = this.httpService.getAccessToken();  // zmien na getTokenFromSrvice
const refreshToken = this.httpService.getRefreshToken();
// const accessToken =  this.httpService.token$.getValue();
const isAccessTokenExpired = this.httpService.isTokenExpired(accessToken);
const isRefreshTokenExpired = this.httpService.isTokenExpired(refreshToken);
if (accessToken != null && !isAccessTokenExpired) {
return next.handle(req);
// tslint:disable-next-line:align
} else if (refreshToken != null && !isRefreshTokenExpired) {
this.httpService.token$.next(null);
// localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
const payload = refreshToken as Token;
return next.handle(req).pipe(() => {
return this.httpService.refreshToken(payload).pipe(
map(res => {
const token = res as Token;
AuthTokenInterceptor.newToken = token.access_token;
const transformRequest = req.clone({
setHeaders: {
  Authorization: `Bearer ${AuthTokenInterceptor.newToken}` //jak w filmie popraw
}
});
return next.handle(transformRequest);
})
);
});
}
}
}*/ // poprzedn






/*map((response) => {
            const newtoken = response as Token;
            // console.log(response);
            AuthTokenInterceptor.newToken = newtoken.access_token;
            localStorage.setItem('access_token', newtoken.access_token);
            this.httpService.token$.next(newtoken.access_token);
            // AuthTokenInterceptor.newToken = response.a
            // tslint:disable-next-line:no-shadowed-variable
            const transformRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${AuthTokenInterceptor.newToken}`
              }
            });
            return next.handle(transformRequest);
          })
        );*/

/*//catchError((error) => {
          //console.log(error);
          //return throwError(() => 'inavalid');
       // });*/
        // pipe(
        // map(response => {
        // console.log(response);
        // localStorage.clear();
        // const tokens = response as Token;
        // localStorage.setItem('access_token', tokens.access_token);

        //  this.httpService.token$.next(tokens.access_token);
        //  console.log(this.httpService.token$.next(tokens.access_token));
        // const token = this.httpService.getTokenFromService();
/*catchError((error) => {
        console.log(error);
        return throwError(() => 'inavalid');
        // return of(false);
      });
    }
  }
}*/
