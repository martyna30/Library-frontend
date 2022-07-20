import { Injectable } from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';

import {HttpService} from './http.service';
import {User} from '../app/models-interface/user';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

   private userTokenObs$ = new BehaviorSubject<string>('');
  private validationErrors: any;

  constructor(private httpService: HttpService) {
  }

  // @ts-ignore
  login(username: string, password: string): Observable<string> {
    this.httpService.generateToken(username, password).subscribe((res) => {
      console.log('before local storage');
      console.log(res);
      const tokenRes = res.substring(17, 255);
      const token = tokenRes.replace('"', '').replace('}', '');
      console.log(token);
      localStorage.setItem('acess_token', token);
    // this.userTokenObs$.next(token);
    // AuthInterceptor.accessToken = token;
    }, response =>  {
      console.log(response);
      this.validationErrors = response.error;
    });
  }

  /*loggedIn() {
    return localStorage.getItem('token');
  }*/


  /*auth(token: string) {
    return this.httpService.auth(token);
  }*/


  /*getTokenFromService() {
    return this.userTokenObs$.asObservable();
  }*/
}
