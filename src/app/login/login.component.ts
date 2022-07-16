import { Component, OnInit } from '@angular/core';
import {UserAuthService} from '../../services/user-auth.service';
import {User} from '../models-interface/user';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthorValidationError} from '../models-interface/authorValidationError';
import {logging} from 'protractor';
import {LoggingValidationError} from '../models-interface/LoggingValidationError';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private token: string;
  private isLoggedIn = false;
  validationErrors: LoggingValidationError;

  username = '';
  password = '';

  constructor(private userAuthService: UserAuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  public signIn() {
    this.userAuthService.login(this.username, this.password).subscribe((token) => {
        this.token = token;

        // this.token = this.userAuthService.getTokenFromService();
        console.log(this.token);
        if (this.token !== null || undefined || '') {
         this.router.navigate(['/users']);
    }} , (response: HttpErrorResponse) => {
        console.log(response.error);
        this.validationErrors = response.error;
        this.isLoggedIn = false;
        console.log(response);
        console.log('login incorrect');
      });
  }

}


