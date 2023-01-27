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
import {Token} from '../models-interface/token';
import {HttpService} from '../../services/http.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Book} from '../models-interface/book';
import {ObjectService} from '../../services/object.service';
import {UserAuthService} from '../../services/user-auth.service';

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
  private token: string;
  private user: Array<string>;
  checkboxOfAuthor: number;
  myFormModel: FormGroup;

  objectToSearch: string;

  private stan;



  private searchedObjectsName: string[] = [];
  private showNamePlaceholder: boolean;

  constructor(config: NgbPaginationConfig,  private objectService: ObjectService,
              private authorService: AuthorService,  private userAuthService: UserAuthService,
              private checkboxService: CheckboxService, private dialog: MatDialog,
              private fb: FormBuilder) {
      this.userAuthService.token$.subscribe((token) => {
      this.token = token;
      this.userAuthService.userProfile$.subscribe((userRole) => {
          this.user = userRole;
        });
    });
  }

  @ViewChild('childAddRef')
  childComponent: AddAuthorComponent;

  @ViewChild('childDeleteRef')
  child2Component: DeleteComponent;

  authorslist: Observable<Array<Author>>;
  ngOnInit(): void {
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
   changeCheckboxList(checkboxOfAuthor: HTMLInputElement) {
    if (checkboxOfAuthor.checked) {
      this.checkboxOfAuthor = Number(checkboxOfAuthor.value);
      this.checkboxService.addToAuthorsMap(Number(this.checkboxOfAuthor));
    }
    else {
     this.checkboxService.removeFromAuthorsMap(Number(this.checkboxOfAuthor));
    }
  }
  // tslint:disable-next-line:typedef
  openDialog(mode) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // tslint:disable-next-line:no-unused-expression
    dialogConfig.panelClass = 'custom-modalbox';

    if (this.token !== null && this.token !== undefined) {
      if (this.user.toString() === 'ROLE_ADMIN' || this.user.toString() === 'ROLE_LIBRARIAN') {
        this.dialog.open(AddAuthorComponent, dialogConfig);
        if (mode === 'edit') {
          this.childComponent.showEditAuthorForm();
        } else {
          this.childComponent.showAddAuthorForm();
        }
      }
      else {
        alert('Function available only for the administrator');
      }
    }else {
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

  loadData() {
    const page = this.page - 1;
    this.authorService.getAuthorsListObservable(page, this.size);
    this.authorslist = this.authorService.getAuthorsFromAuthorsService();
    this.total = this.authorService.getTotalCountOfAuthors();
    console.log(this.authorslist);
    if (this.checkboxService.lengthAuthorsMap() > 0) {
      this.checkboxService.removeFromAuthorsMap(this.checkboxOfAuthor);
    }
  }

  deleteAuthor() {
    if (this.token !== null && this.token !== undefined) {
      if (this.user.toString() === 'ROLE_ADMIN') {
        this.child2Component.deleteAuthor();
      } else {
        alert('Function available only for the administrator');
      }
    }
    else {
      alert('Function available only for the administrator');
    }
  }
  // tslint:disable-next-line:typedef
  toggleNamePlaceholder() {
    this.showNamePlaceholder = (this.myFormModel.get('nameInput').value === '');
  }
  // tslint:disable-next-line:typedef
  checkTheChangeName() {
    this.myFormModel.get('nameInput').valueChanges.subscribe(
      response => this.searchObjectsWithSpecifiedAuthor(response)
    );

  }

  // tslint:disable-next-line:typedef
  searchObjectsWithSpecifiedAuthor(objectToSearch) {
    if (objectToSearch !== undefined && objectToSearch !== '') {
      this.objectService.getObjectsWithSpecifiedTitleOrAuthor(objectToSearch).subscribe(objectName => {
        // tslint:disable-next-line:no-shadowed-variable
        this.searchedObjectsName = objectName.map(objectName => objectName.name);
      });
    }
  }

}

