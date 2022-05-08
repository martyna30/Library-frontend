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

  private dialogRef: MatDialogRef<AddBookComponent>;


  constructor(  private cdRef: ChangeDetectorRef, config: NgbPaginationConfig, private bookService: BookService, private checkboxService: CheckboxService,
                private dialog: MatDialog) {}

  /*ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }*/
  // tslint:disable-next-line:typedef
  @ViewChild('childAddRef')
  childComponent: AddBookComponent;

  // @ViewChild('childDeleteRef')
  // child2Component: DeleteComponent;
// <app-delete #childDeleteRef [page]="page" [size]="size" ></app-delete>
  bookId: string;
  bookslist: Observable<Array<Book>>;
  private stan;

  // tslint:disable-next-line:typedef
  ngOnInit() { // uruchamia sie jako 2 metoda tylko raz inicjalizuje dane w komponencie(lepiej ją uzywać niż konstruktor)
    this.loadData();
    console.log(this.page, this.size);
  }
  // tslint:disable-next-line:typedef


  // tslint:disable-next-line:typedef


  getColor(): string {
    // return this.bookslist.length >= 0 ? 'blue' : 'white';
    return 'blue';
  }

  // tslint:disable-next-line:typedef
  changeCheckboxList(checkboxOfBook: HTMLInputElement) {    // checkboxOfBook: HTMLInputElement
    // tslint:disable-next-line:align
    if (checkboxOfBook.checked) {
      this.checkboxService.addToBooksMap(Number(checkboxOfBook.value));

    } else {
      this.checkboxService.removeFromBooksMap(Number(checkboxOfBook.value));
    }
  }

  openDialog(mode: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = mode;
    this.stan = mode;

    //// tslint:disable-next-line:no-unused-expression
    dialogConfig.panelClass = 'custom-modalbox';

    this.dialogRef = this.dialog.open(AddBookComponent, dialogConfig);
    console.log(this.dialogRef);
    if (mode === 'edit') {
        this.childComponent.showEditBookForm();
    }
    else {
      this.childComponent.showBookForm();
    }

    // this.dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
   // });
    // his.matDialog.closeAll();*/

    this.cdRef.detectChanges();
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
    this.bookslist = this.bookService.getBooksFromBooksService();
    this.total = this.bookService.getTotalCountBooks();
    console.log(this.bookslist);
  }
  // tslint:disable-next-line:typedef


  // tslint:disable-next-line:typedef
  /*deleteBook() {
    this.child2Component.deleteBook();
  }* ///(click)="deleteBook()"*/
}


