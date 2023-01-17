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
import {RentalComponent} from './rental/rental.component';
import {UserDto} from './models-interface/userDto';
import {Token} from './models-interface/token';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private userdata: string;
  private tokenFromService: string;
  private rentaltableIsHidden: boolean;
  title: string;

  constructor(private http: HttpService, private userAuthService: UserAuthService,
              private bookService: BookService, private router: Router) {
  }


  loggedInUsername: string;
  isloggedin: boolean;
  loginFormIsHidden = true;
  isBorrowedBook: boolean;

  rentalList: () => Observable<Array<Rental>>;

  @ViewChild('childCheckOutRef')
  checkoutBookComponent: CheckOutBookComponent;

  @ViewChild('rentalRef')
  rentalComponent: RentalComponent;
  userDto: UserDto;

   ngOnInit() {
     this.checkStatus();
     // this.setUsername();
     this.checkToken();
    // await this.loadDataBook();

    // localStorage.removeItem('refresh_token');
    // localStorage.removeItem('password');
    // localStorage.removeItem('username');

  }

  checkToken(): void {
    this.userAuthService.getTokenFromService().subscribe(token => {
        this.tokenFromService = token;
      });

    if (this.tokenFromService !== null && this.tokenFromService !== undefined) {
        this.isloggedin = true;
      }
    /*if (this.isloggedin) {
        this.userAuthService.userName$.subscribe(username => {
          this.loggedInUsername = username;
        });
      }*/
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
      if (this.isloggedin === true) {
        this.userAuthService.userName$.subscribe((username) => {
          this.loggedInUsername = username;
          this.userDto.username = username;
        });
      }
    });
    this.bookService.getRentalListForUser(this.userDto);
    this.rentalList = this.bookService.getRentalsFromBooksService;
    if (this.rentalList.length > 0) {
        this.showRentalTable();
    }
  }


    /*setUsername();: void {
    this.userAuthService.userName$.subscribe((username) => {
      this.loggedInUsername = username;
      this.userDto.username = username;
     });
   };
    }*/

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

  // tslint:disable-next-line:typedef
  /*loadDataBook() {
    /*this.bookService.isBorrowed$.subscribe( isBorrowed => {
      this.isBorrowedBook = isBorrowed;
    });*/
    // this.bookService.borrowedBooks$.subscribe(borrowedBooks => {
      // this.rentalList.push(borrowedBooks);*/

    showRentalTable() {
    this.rentalComponent.showRentalTable();
    this.rentaltableIsHidden = false;
  }
}





























