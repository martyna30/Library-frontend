import {Component, Injectable, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {User} from '../models-interface/user';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthorValidationError} from '../models-interface/authorValidationError';

import {LoggingValidationError} from '../models-interface/LoggingValidationError';
import {Observable} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {Token} from '../models-interface/token';
import {AuthTokenInterceptor} from '../interceptors/auth-token-interceptor';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   private isComming: boolean;

  isloggedin: boolean;

   @Input()
   isHidden = true;

   @Output()
   eventLogin: EventEmitter<boolean> = new EventEmitter<boolean>();

   username = '';
   password = '';

   payload: Token = {
     access_token: '',
     refresh_token: ''
   };

   constructor(private userAuthService: UserAuthService, private http: HttpService, private router: Router) {
   }

   ngOnInit(): void {
   }

  // tslint:disable-next-line:typedef
   public signIn(){
     console.log(this.http);
     console.log(this.username);
     console.log(this.password);

     this.http.generateToken(this.username, this.password).subscribe(
       (tokenIsComming) => {
         this.isComming = tokenIsComming;
         if (this.isComming) {
           this.isloggedin = true;
           this.eventLogin.emit(this.isloggedin);
           if (this.isloggedin === true) {
             this.isHidden = true;
           }
           this.router.navigate(['/users']);
         } else {
           console.log('login incorrect');
         }
       });
    // this.token = this.userAuthService.getTokenFromService();
    // console.log(this.token);
     // if (this.token !== null) {
   }




}


