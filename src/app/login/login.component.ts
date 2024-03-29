import {Component, Injectable, OnInit, Output, EventEmitter, Input, ViewChild} from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';

import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthorValidationError} from '../models-interface/authorValidationError';

import {LoggingValidationError} from '../models-interface/LoggingValidationError';
import {Observable} from 'rxjs';
import {HttpService} from '../../services/http.service';
import {Token} from '../models-interface/token';
import {AuthTokenInterceptor} from '../interceptors/auth-token-interceptor';
import {UserDto} from '../models-interface/userDto';
import {NewUserDto} from '../models-interface/newUserDto';
import {CheckOutBookComponent} from '../check-out-book/check-out-book.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

   login: string;
   password: string;
   private isComming: boolean;
   private response: any;


   registerFormIsHidden = true;

   myFormModel: FormGroup;

   loggingValidationError: LoggingValidationError;

   isloggedin: boolean;
   isRegister: boolean;

   userDto: UserDto;

   @Input()
   loginFormIsHidden: boolean;

   payload: Token = {
     access_token: '',
     refresh_token: ''
   };

  // @ts-ignore


   constructor(private fb: FormBuilder, private userAuthService: UserAuthService,
               private http: HttpService, private router: Router) {
   }


   ngOnInit(): void {
     this.myFormModel = this.fb.group({
         loginInput: '',
         passwordInput: '',
         emailInput: ''
       });

   }
   // tslint:disable-next-line:typedef
   public signIn(login: string){
     this.login = login;

     const userDto: UserDto = {
       username : this.myFormModel.get('loginInput').value,
       password: this.myFormModel.get('passwordInput').value
     };
     // @ts-ignore
     this.userAuthService.login(userDto).subscribe(
       (tokenIsComming) => {
         this.isComming = tokenIsComming;
         if (this.isComming) {
           this.loginFormIsHidden = true;
           this.router.navigate(['/']);
         }
       }, (response: HttpErrorResponse) => {
         console.log(response.error);
         this.loggingValidationError = response.error;
         this.isloggedin = false;
       });
    // this.token = this.userAuthService.getTokenFromService();
    // console.log(this.token);
     // if (this.token !== null) {
   }
  registerNewUser() {
    this.loginFormIsHidden = true;
    this.registerFormIsHidden = false;
  }

  register() {
    const newuser: NewUserDto = {
      username: this.myFormModel.get('loginInput').value,
      password: this.myFormModel.get('passwordInput').value,
      email: this.myFormModel.get('emailInput').value
    };
    this.userAuthService.register(newuser).subscribe(response => {
        this.response = response;
        if (response !== undefined) {
          this.isRegister = true;
          if (this.isRegister) {
            alert('To complete your registration, click on the link in the email that we have just sent you.');
            this.registerFormIsHidden = true;
            this.loginFormIsHidden = false;
          }
          console.log(response);
        }
      }, (response: HttpErrorResponse) => {
        this.loggingValidationError = response.error;
        this.isRegister = false;
      }
    );
  }

}


