import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {Author} from '../models-interface/author';

import {AuthorService} from '../../services/author.service';
import {CheckboxService} from '../../services/checkbox.service';
import {Observable} from 'rxjs';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AddBookComponent} from '../add-book/add-book.component';
import {DeleteComponent} from '../delete/delete.component';
import {AddAuthorComponent} from '../add-author/add-author.component';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.scss']
})
export class AuthorsComponent implements OnInit {
  isDisabled: false;
  page = 1;
  size = 10;
  total: Observable<number>;
  // authorslist: Array<Author> = [];

  constructor(config: NgbPaginationConfig, private authorService: AuthorService, private checkboxService: CheckboxService, private dialog: MatDialog) {}
  // authors: Observable<Author[]>;
  // @ts-ignore


  @ViewChild('childAddRef')
  childComponent: AddAuthorComponent;

  @ViewChild('childDeleteRef')
  child2Component: DeleteComponent;

  authorslist: Observable<Array<Author>>;
  ngOnInit(): void {
    /*this.authorService.getAuthorsFromAuthorsService().subscribe(authors => {
      this.authorslist = authors; });*/

    this.loadData();
  }

  getColor(): string {
    return 'blue';
  }

  // tslint:disable-next-line:typedef
   changeCheckboxList(checkboxOfAuthor: HTMLInputElement) {
    if (checkboxOfAuthor.checked) {
      this.checkboxService.addToAuthorsMap(Number(checkboxOfAuthor.value));
    }
    else {
     this.checkboxService.removeFromAuthorsMap(Number(checkboxOfAuthor.value));
    }
  }
  // tslint:disable-next-line:typedef
  openDialog(mode) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // tslint:disable-next-line:no-unused-expression
    dialogConfig.panelClass = 'custom-modalbox';

    this.dialog.open(AddAuthorComponent, dialogConfig);

    if (mode === 'edit') {
      this.childComponent.showEditAuthorForm();
    } else {
      this.childComponent.showAddAuthorForm();
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
    this.authorService.getAuthorsListObservable(page, this.size);
    this.authorslist = this.authorService.getAuthorsFromAuthorsService();
    this.total = this.authorService.getTotalCountOfAuthors();
    console.log(this.authorslist);
  }

  /*deleteAuthor() {
    this.child2Component.deleteAuthor(); //dopisz dla autora!!
  }*/
}

