import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {BookService} from '../../services/book.service';
import {Book} from '../models-interface/book';
import {HttpErrorResponse} from '@angular/common/http';
import {BookValidationError} from '../models-interface/bookValidationError';
import {Rental} from '../models-interface/rental';
import {D} from '@angular/cdk/keycodes';
import {BehaviorSubject, Observable} from 'rxjs';
import {Router} from '@angular/router';
import {UserDto} from '../models-interface/userDto';
import {UserAuthService} from '../../services/user-auth.service';

@Component({
  selector: 'app-check-out-book',
  templateUrl: './check-out-book.component.html',
  styleUrls: ['./check-out-book.component.scss']
})
export class CheckOutBookComponent implements OnInit {
  private isLoggedin: boolean;

  constructor(private checkboxservice: CheckboxService, private bookService: BookService, private router: Router, private userAuthService: UserAuthService) {
  }

  @Input()
  checkboxOfBook: number;

  @Input()
  page;
  @Input()
  size;

  amountOfBookToCheckout: number;
  private checkedList: Map<number, number>;

  @Output()
  loadBooks: EventEmitter<any> = new EventEmitter();

  /// @Output()
 //  loadBorrowedData: EventEmitter<any> = new EventEmitter();
  // @Output()
  // isborrowedBook = new EventEmitter<boolean>();
  private idBook: number;

  private bookToCheckout: Book;
  private bookExist: boolean;

  validationErrors: BookValidationError;
  private isborrowed: boolean;

  private username: string;
  private password: string;


  ngOnInit(): void {
    this.userAuthService.userName$.subscribe((username) => {
     this.username = username;
    });

    /*this.userAuthService.userPassword$.subscribe((password) => {
      this.password = password;
    });*/
  }





  checkOutBook() {
    const userDto = {
      username : this.username,
      // password: this.password
    };
    if (this.checkboxservice.lengthBooksMap() === 1) {
      this.checkedList = this.checkboxservice.getBooksMap();
      this.idBook = Number(this.checkedList.keys().next().value);
      if (confirm('Are you sure to checkout book ')) {
        this.bookService.checkOutBook(this.idBook, userDto).subscribe((borrowedbook) => {
          if (borrowedbook) {
            this.isborrowed = true;
            // this.isborrowedBook.emit(this.isborrowed);
          }
          /*const rental: Rental = {
            id: this.idBook,
            title: borrowedbook.title,
            // startingDate: borrowedbook.borrowedBooks.(borrowedbooks => borrowedbooks.startingDate),
            // finishDate: borrowedbook.borrowedBooks
            amountOfRental: 1
          };*/
          // this.isBorrowed$.next(true);
          // this.rental = rental;
          // this.borrowedBooks$.next(rental);
          // this.loadData.emit(this.rental);
          this.loadBooks.emit();
          this.checkboxservice.removeFromBooksMap(this.checkboxOfBook);

        }, (response: HttpErrorResponse) => {
          this.isborrowed = false;
          this.validationErrors = response.error;
          this.userAuthService.isloggedin$.subscribe(isLoggedin => {
            this.isLoggedin = isLoggedin;
          });
          if (this.isLoggedin === false && (response.status === 403 || response.status === 401)) {
           alert('Function available only for the logged user');
          }
        });
      } else {
        alert('Amount of books must be at least 1');
      }
    }
      // tslint:disable-next-line:typedef
    if (this.checkboxservice.lengthBooksMap() > 1) {
        alert('jest zaznaczony więcj niż jeden, może byc jeden');
    }
    if (this.checkboxservice.lengthBooksMap() === 0) {
        alert('Brak zaznaczonego');
    }
  }




}
