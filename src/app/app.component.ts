import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {HttpService} from '../services/http.service';
import {BookService} from '../services/book.service';
import {Book} from './models-interface/book';
import {CheckboxService} from '../services/checkbox.service';
import {AddBookComponent} from './add-book/add-book.component';
import {UserAuthService} from '../services/user-auth.service';
import {Router} from '@angular/router';
import {UserProfile} from './models-interface/user-profile';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userdata: string;
  private tokenFromService: string;

    constructor(private http: HttpService, private userAuth: UserAuthService, private router: Router) {
    }

  title = 'library-frontend';


  isloggedin: boolean;
  loginFormIsHidden = true;


  ngOnInit(): void {
    this.checkToken();
    // this.checkStatus();
    // localStorage.clear();
  }
  checkToken(): void {
    this.http.token$.subscribe(data => {
      this.userdata = data;
    });
    const accesstoken = localStorage.getItem('access_token');
    const newtoken = localStorage.getItem('new_token');
    if (this.userdata !== null && this.userdata !== undefined) {
      this.isloggedin = true;
      this.http.isloggedin$.next(this.isloggedin);
      this.checkStatus();
      console.log('zalog');
    } else {
      /*this.isloggedin = true;
      this.http.isloggedin$.next(this.isloggedin);
      if (accesstoken !== null && accesstoken !== undefined) {
        this.http.token$.next(accesstoken);
      } else {
        this.http.token$.next(newtoken);
      }*/
      this.http.getTokenFromService().subscribe(token => {
        this.tokenFromService = token;
      });
      this.checkStatus();
      console.log('zalog');
    }
  }

  checkStatus(): void {
    this.http.isloggedin$.subscribe(isLoggedin => {
      this.isloggedin = isLoggedin;
    });
  }

  logout() {
    this.http.logout();
    this.isloggedin = false;
  }


  showLoginForm() {
    if (this.loginFormIsHidden === true) {
      this.loginFormIsHidden = false;
    }
  }

  /*changeStatus() {
    if (!this.isRegister) {
     this.isRegister = true;
    } else {
      this.isRegister = false;
    }*/
  // <app-login [loginFormIsHidden]="loginFormIsHidden" (eventRegister)="changeStatus()"></app-login>
  // *ngIf="!isloggedin" (click)="showLoginForm()"
}










