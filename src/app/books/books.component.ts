import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {CheckboxService} from '../../services/checkbox.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddBookComponent} from '../add-book/add-book.component';

import {DeleteComponent} from '../delete/delete.component';

import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectService} from '../../services/object.service';
import {UserAuthService} from '../../services/user-auth.service';
import {CheckOutBookComponent} from '../check-out-book/check-out-book.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  isDisabled: false;
  page = 1;
  size = 10;
  total: Observable<number>;
  private token: string;
  private userdata: string;
  checkboxOfBook: number;
  myFormModel: FormGroup;

  bookId: string;
  booksList: Observable<Array<Book>>;
  bookslist$: any[];

  objectToSearch: string;

  private stan;

  private searchedObjectsName: string[] = [];
  private showNamePlaceholder: boolean;
  private userRole: Array<string>;

  private isBorrowed: boolean;


  constructor(private bookService: BookService, private checkboxService: CheckboxService,
              private dialog: MatDialog, private objectService: ObjectService,
              private userAuthService: UserAuthService, private fb: FormBuilder) {
    this.userAuthService.token$.subscribe((token) => {
      this.token = token;
    });
    this.userAuthService.userProfile$.subscribe((userRole) => {
      this.userRole = userRole;
    });
  }

  @ViewChild('childAddRef')
  addBookComponent: AddBookComponent;

  @ViewChild('childDeleteRef')
  deleteComponent: DeleteComponent;

  @ViewChild('childCheckOutRef')
  checkOutBookComponent: CheckOutBookComponent;

  // tslint:disable-next-line:typedef
  ngOnInit() { // uruchamia sie jako 2 metoda tylko raz inicjalizuje dane w komponencie(lepiej ją uzywać niż konstruktor)
    this.myFormModel = this.fb.group({
      nameInput: '',
    });
    this.loadData();
    this.checkTheChangeName();
  }
  getColor(): string {
    return 'blue';
  }
  // tslint:disable-next-line:typedef
  changeCheckboxList(checkboxOfBook: HTMLInputElement) {    // checkboxOfBook: HTMLInputElement
    // tslint:disable-next-line:align
    if (checkboxOfBook.checked) {
      this.checkboxOfBook = Number(checkboxOfBook.value);
      this.checkboxService.addToBooksMap(Number(this.checkboxOfBook));

    } else {
      this.checkboxService.removeFromBooksMap(Number(this.checkboxOfBook));

    }
  }

// tslint:disable-next-line:typedef
  openDialog(mode: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mode;
    this.stan = mode;
    dialogConfig.panelClass = 'custom-modalbox';
    if (this.token !== null && this.token !== undefined) {
      console.log(this.userRole.toString());
      if (this.userRole.toString() === 'ROLE_ADMIN' || this.userRole.toString() === 'ROLE_LIBRARIAN') {
        this.dialog.open(AddBookComponent, dialogConfig);
        if (mode === 'edit') {
          this.addBookComponent.showEditBookForm();
        } else {
          this.addBookComponent.showBookForm();
        }
      }
      else {
        alert('Function available only for the administrator');
      }
    } else {
      alert('Function available only for the administrator');
    }
  }

  // tslint:disable-next-line:typedef
  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;

    console.log(this.page);
    this.loadData();
  }

  // tslint:disable-next-line:typedef
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }

  // tslint:disable-next-line:typedef
  loadPage(page: any) {
    console.log(page);
    if (page !== 1) {
      this.page = page;
      console.log(page);
      this.loadData();
    }
  }

  // tslint:disable-next-line:typedef
  loadData() {
    const page = this.page - 1;
    this.bookService.getBookListObservable(page, this.size);
    this.booksList = this.bookService.getBooksFromBooksService();
    this.booksList.subscribe(books => {
      this.bookslist$ = books;
    });
    this.total = this.bookService.getTotalCountBooks();
    console.log(this.bookslist$);
    if (this.checkboxService.lengthBooksMap() > 0) {
      this.checkboxService.removeFromBooksMap(this.checkboxOfBook);
    }
  }

  // tslint:disable-next-line:typedef
  checkoutBook() {
    if (this.token !== null && this.token !== undefined) {
      this.checkOutBookComponent.checkOutBook();
    }
    else {
      alert('Function available only for the logged user');
    }
  }

  deleteBook() {
    if (this.token !== null && this.token !== undefined) {
      if (this.userRole.toString() === 'ROLE_ADMIN') {
        this.deleteComponent.deleteBook();
      }
      else {
        alert('Function available only for the administrator');
      }
    }else {
      alert('Function available only for the administrator');
    }
  }

  // tslint:disable-next-line:typedef
  toggleNamePlaceholder() {
    this.showNamePlaceholder = (this.myFormModel.get('nameInput').value === '');
  }

  checkTheChangeName() {
    this.myFormModel.get('nameInput').valueChanges.subscribe(
        response => this.searchObjectsWithSpecifiedTitleOrAuthor(response)
      );

  }

  // tslint:disable-next-line:typedef
  searchObjectsWithSpecifiedTitleOrAuthor(objectToSearch) {
    if (objectToSearch !== undefined && objectToSearch !== '') {
      this.objectService.getObjectsWithSpecifiedTitleOrAuthor(objectToSearch).subscribe(objectName => {
        // tslint:disable-next-line:no-shadowed-variable
        this.searchedObjectsName = objectName.map(objectName => objectName.name);
      });
    }
  }

}





