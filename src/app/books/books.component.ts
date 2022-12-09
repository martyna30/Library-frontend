import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {CheckboxService} from '../../services/checkbox.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AddBookComponent} from '../add-book/add-book.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {applySourceSpanToExpressionIfNeeded} from '@angular/compiler/src/output/output_ast';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {DeleteComponent} from '../delete/delete.component';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import {Token} from '../models-interface/token';
import {UserProfile} from '../models-interface/user-profile';
import {HttpService} from '../../services/http.service';
import {getToken} from 'codelyzer/angular/styles/cssLexer';
import {ListBook} from '../models-interface/listBook';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectService} from '../../services/object.service';

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
  private user: Array<string>;
  checkboxOfBook: number;
  myFormModel: FormGroup;

  bookId: string;
  booksList: Observable<Array<Book>>;
  bookslist: any[];

  objectToSearch: string;

  private stan;


  private searchedObjectsName: string[] = [];
  private showNamePlaceholder: boolean;


  constructor(private bookService: BookService, private checkboxService: CheckboxService,
              private dialog: MatDialog, private objectService: ObjectService,
              private http: HttpService, private fb: FormBuilder) {
    this.http.token$.subscribe((token) => {
      this.token = token;
    });
    this.http.userProfile$.subscribe((userRole) => {
      this.user = userRole;
    });
  }

  @ViewChild('childAddRef')
  childComponent: AddBookComponent;

  @ViewChild('childDeleteRef')
  child2Component: DeleteComponent;


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
      console.log(this.user.toString());
      // tslint:disable-next-line:triple-equals
      if (this.user.toString() === 'ROLE_ADMIN' || this.user.toString() === 'ROLE_LIBRARIAN') {
        this.dialog.open(AddBookComponent, dialogConfig);
        if (mode === 'edit') {
          this.childComponent.showEditBookForm();
        } else {
          this.childComponent.showBookForm();
        }
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
      this.bookslist = books;
    });
    this.total = this.bookService.getTotalCountBooks();
    console.log(this.bookslist);
    if (this.checkboxService.lengthBooksMap() > 0) {
      this.checkboxService.removeFromBooksMap(this.checkboxOfBook);
    }
  }

  deleteBook() {
    if (this.token !== null && this.token !== undefined) {
      if (this.user.toString() === 'ROLE_ADMIN') {
        this.child2Component.deleteBook();
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





