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
  private token?: Observable<UserProfile | null>;

    constructor(private http: HttpService, private userAuth: UserAuthService, private router: Router) {
  }

  title = 'library-frontend';

  isloggedin = true;
  isHidden = true;

  ngOnInit(): void {
    this.checkStatus();
    // localStorage.clear();
  }
  // tslint:disable-next-line:typedef
  checkStatus(): void {
   // this.http.token$.subscribe((data) => {
   this.http.getTokenFromService().subscribe(data => {
     this.token = data;
   });
   if (this.token !== null) {
      this.isloggedin = true;
   }
    else  {
     this.isloggedin = !this.isloggedin;
    }
  }

  logout() {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
    this.change();
    this.showLoginForm();

  }

  change() {
    if (this.isloggedin) {
      this.isloggedin = !this.isloggedin;
    } else {
      this.isloggedin = true;
    }
  }

  showLoginForm() {
    this.isHidden = !this.isHidden;
  }
}










