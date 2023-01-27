import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {BookService} from '../../services/book.service';

import {HttpErrorResponse} from '@angular/common/http';
import {BookValidationError} from '../models-interface/bookValidationError';
import {Rental} from '../models-interface/rental';

import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {UserDto} from '../models-interface/userDto';
import {UserAuthService} from '../../services/user-auth.service';
import {BookDto} from '../models-interface/bookDto';


@Component({
  selector: 'app-check-out-book',
  templateUrl: './check-out-book.component.html',
  styleUrls: ['./check-out-book.component.scss']
})
export class CheckOutBookComponent implements OnInit {
  private isLoggedin: boolean;
  rentalList: Array<Rental>;

  isHidden = true;

  username: string;

  rentallist: Observable<Array<Rental>>;

  @Input()
  checkboxOfBook: number;

  @Input()
  page;
  @Input()
  size;


  private checkedList: Map<number, number>;

  @Output()
  loadBooks: EventEmitter<any> = new EventEmitter();


  private idBook: number;

  validationErrors: BookValidationError;
  private isborrowed: boolean;

  userDto: UserDto;

  bookDto: BookDto;

  constructor(private checkboxservice: CheckboxService, private bookService: BookService, private router: Router, private userAuthService: UserAuthService) {
  }


  ngOnInit(): void {
    this.userAuthService.userName$.subscribe((username) => {
      this.username = username;
    });
  }



  checkOutBook() {
    if (this.checkboxservice.lengthBooksMap() === 1) {
      this.checkedList = this.checkboxservice.getBooksMap();
      this.idBook = Number(this.checkedList.keys().next().value);
      this.userDto = {
        username: this.username,
        // password: this.password
      };
      /*this.bookDto = {
        id: this.idBook,
      };*/
      if (confirm('Are you sure to checkout book ')) {
        this.bookService.getBookById(this.idBook).subscribe((book) => {
          this.bookDto = book;
          if (this.bookDto !== null && this.bookDto !== undefined) {
            this.bookService.checkOutBook(this.bookDto, this.username).subscribe((borrowedbook) => {
              if (borrowedbook === true) {
                this.isborrowed = true;
                this.getRentalListForUser();
              }
              if (this.isborrowed) {
                this.loadBooks.emit();
                this.checkboxservice.removeFromBooksMap(this.checkboxOfBook);
              }

            }, (response: HttpErrorResponse) => {
              this.isborrowed = false;
              this.validationErrors = response.error;
              if (response.status === 422) {
                alert(this.validationErrors.amountOfBook);
              }
              this.userAuthService.isloggedin$.subscribe(isLoggedin => {
                this.isLoggedin = isLoggedin;
              });
              if (this.isLoggedin === false && (response.status === 403 || response.status === 401)) {
                alert('Function available only for the logged user');
              }
            });
          }
        }, (response: HttpErrorResponse) => {
          this.isborrowed = false;
          this.validationErrors = response.error;
          alert('Amount of book must by at least 1');
        });
        if (this.checkboxservice.lengthBooksMap() > 1) {
          alert('jest zaznaczony więcj niż jeden, może byc jeden');
        }
        if (this.checkboxservice.lengthBooksMap() === 0) {
          alert('Brak zaznaczonego');
        }
      }
    }
  }

  // tslint:disable-next-line:typedef
  getRentalListForUser() {

    this.bookService.getRentalListForUser(this.username);
    this.rentallist = this.bookService.getRentalListObservable();
    this.rentallist.subscribe(rentals => {
      this.rentalList = rentals;
      if (this.rentalList.length > 0) {
        this.showRentalTable();
      }
    });
  }

  showRentalTable(): void {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  close() {
    this.isHidden = true;
    }

}
