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

    constructor(private http: HttpService, private userAuth: UserAuthService, private router: Router) {
  }

  title = 'library-frontend';

  isloggedin = true;
  isHidden = true;

  ngOnInit(): void {
    this.checkStatus();
    // localStorage.clear();
  }
  checkStatus(): void {
    this.http.token$.subscribe(data => {
      this.userdata = data;
    });
    if (this.userdata !== null && this.userdata !== undefined) {
      this.isloggedin = true;
      console.log('zalog');
    }
    else {
      // this.isloggedin = !this.isloggedin;
      this.isloggedin = false;
      console.log(' nie zalog');
    }
  }

  logout() {
    localStorage.clear();
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










