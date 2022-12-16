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
import {colors} from '@angular/cli/utilities/color';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userdata: string;
  private tokenFromService: string;

    constructor(private http: HttpService, private userAuthService: UserAuthService, private router: Router) {
    }

  title = 'library-frontend';

  loggedInUsername: string;
  isloggedin: boolean;
  loginFormIsHidden = true;


  ngOnInit(): void {
    this.checkToken();
    this.checkStatus();
    // localStorage.clear();
  }
  checkToken(): void {
    this.userAuthService.token$.subscribe(data => {
      this.userdata = data;
    });
    const accesstoken = localStorage.getItem('access_token');
    const newtoken = localStorage.getItem('new_token');
    if (this.userdata !== null && this.userdata !== undefined) {
      console.log('zalog');
    } else {
      this.userAuthService.getTokenFromService().subscribe(token => {
        this.tokenFromService = token;
      });
      console.log('zalog');
    }
  }

  getUrl(): string {
    return this.router.url;
  }

  checkStatus(): void {
    this.userAuthService.isloggedin$.subscribe(isLoggedin => {
      this.isloggedin = isLoggedin;
    });

    if (this.isloggedin) {
      this.userAuthService.loggedInUsername$.subscribe(username => {
       this.loggedInUsername = username;
      });
    }
  }

  logout() {
    this.userAuthService.logout();
    this.isloggedin = false;
  }


  showLoginForm() {
    if (this.loginFormIsHidden === true) {
      this.loginFormIsHidden = false;
    }
  }


  changeColor() {
    return
  }
}










