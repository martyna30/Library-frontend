import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {HttpService} from '../services/http.service';
import {BookService} from '../services/book.service';
import {Book} from './models-interface/book';
import {CheckboxService} from '../services/checkbox.service';
import {AddBookComponent} from './add-book/add-book.component';
import {UserAuthService} from '../services/user-auth.service';
import {Router} from '@angular/router';
import {UserProfile} from './models-interface/user-profile';
import {async, asyncScheduler, Observable} from 'rxjs';
import {colors} from '@angular/cli/utilities/color';
import {Rental} from './models-interface/rental';
import {any} from 'codelyzer/util/function';
import {DeleteComponent} from './delete/delete.component';
import {CheckOutBookComponent} from './check-out-book/check-out-book.component';
import {error} from 'protractor';
import {resolve} from '@angular/compiler-cli/src/ngtsc/file_system';

import {UserDto} from './models-interface/userDto';
import {Token} from './models-interface/token';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private tokenFromService: string;

  title: string;

  loggedInUsername: string;
  isloggedin: boolean;
  loginFormIsHidden = true;


  @ViewChild('childCheckOutRef')
  checkoutBookComponent: CheckOutBookComponent;


  userDto: UserDto;



  constructor(private http: HttpService, private userAuthService: UserAuthService,
              private bookService: BookService, private router: Router) {
  }


   ngOnInit() {
     //localStorage.removeItem('access_token');
     //localStorage.removeItem('refresh_token');
     //localStorage.removeItem('username');
     //localStorage.removeItem('borrowedBooks');
     this.userAuthService.userName$.subscribe((username) => {
       this.loggedInUsername = username;
     });
     this.checkStatus();
     this.checkToken();
  }

  checkToken(): void {
    this.userAuthService.getTokenFromService().subscribe(token => {
        this.tokenFromService = token;
      });

    if (this.tokenFromService !== null && this.tokenFromService !== undefined) {
        this.isloggedin = true;
      }
    this.isloggedin = false;
    console.log('Access denied, you have to log in');
  }



  getUrl(): string {
    return this.router.url;
  }
  // tslint:disable-next-line:typedef

 checkStatus() {
   this.userAuthService.isloggedin$.subscribe((isloggedin) => {
     this.isloggedin = isloggedin;
   });
  }


  getRentalListForUser() {
    this.checkoutBookComponent.getRentalListForUser();
  }
    logout() {
    this.userAuthService.logout();
    this.isloggedin = false;
    this.userAuthService.isloggedin$.next(false);
    }



    showLoginForm() {
    if (this.loginFormIsHidden === true) {
      this.loginFormIsHidden = false;
    }
  }

}





























