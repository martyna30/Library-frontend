import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional, Output,
  SimpleChanges
} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {AuthorService} from '../../services/author.service';
import {Author} from '../models-interface/author';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BookTag} from '../models-interface/bookTag';
import {BookValidationError} from '../models-interface/bookValidationError';
import {AuthorValidationError} from '../models-interface/authorValidationError';
import {CheckboxService} from '../../services/checkbox.service';
import {FormControl} from '@angular/forms';
import {debounceTime, map, startWith} from 'rxjs/operators';
import {Observable, pipe} from 'rxjs';
import {placeholdersToParams} from '@angular/compiler/src/render3/view/i18n/util';
import {ifTrue} from 'codelyzer/util/function';
import {yearsPerPage} from '@angular/material/datepicker';
import {MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef} from '@angular/material/dialog';
import {MatDialog} from '@angular/material/dialog';
import {HttpErrorResponse} from '@angular/common/http';
import {error} from 'protractor';


// @ts-ignore
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements  OnInit {
  @Input()
  page: number;
  @Input()
  size: number;

  @Output()
  loadData: EventEmitter<any> = new EventEmitter();

  isHidden = true;
  showTitlePlaceholder: boolean;
  showAuthorForenamePlaceholder = [];
  showAuthorSurnamePlaceholder = [];
  showBookTagPlaceholder = [];
  showYearOfPublicationPlaceholder: boolean;

  filteredTitles: string[] = [];
  filteredAuthorsForenameList = [];
  filteredAuthorsSurnameList = [];
  filteredBooksTagsList = [];
  filteredYears: number[];
  filteredBooksSignature: string[] = [];

  myFormModel: FormGroup;
  authors: FormArray;
  bookTags: FormArray;

  validationErrors: BookValidationError;
  authorSurnameError = [];
  private isCreated = false;
  private bookExist = false;
  private mode;
  private checkedList: Map<number, number>;
  private idBook: number;
  private bookToModified: Book;

  constructor(private authorService: AuthorService,
              private bookService: BookService,
              private checkboxservice: CheckboxService,
              private fb: FormBuilder) {}


  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      titleInput: '',
      authors: this.fb.array([]),
      bookTags: this.fb.array([]),
      yearOfPublicationInput: '',
      signatureInput: ''
    });

    this.addNextAuthor();
    this.addNextBooksTag();
    this.checkTheChangeTitle();
    this.checkTheChangeYear();
  }

  closeDialog(): void {
    this.isHidden = true;
    this.clearBookForm();
    this.clearValidationErrors();
  }


  showBookForm(): void {
    this.mode = 'add';

    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }
  // tslint:disable-next-line:typedef
  checkTheChangeTitle() {
    this.myFormModel.get('titleInput').valueChanges.subscribe(
      response => this.filterBookTitles(response)
    );
  }
  // tslint:disable-next-line:typedef
  private filterBookTitles(title) {
    // setTimeout(() => 3000); {
      this.bookService.getBooksWithSpecifiedTitle(title).subscribe(book => {
        // tslint:disable-next-line:no-shadowed-variable
        this.filteredTitles = book.map(book => book.title);
        console.log(book);
      });
  }
  // tslint:disable-next-line:typedef
  checkTheChangeForename() {
    const index = this.authors.controls.length - 1;
    const authorForenameInput = this.authors.controls[index].get('authorForenameInput');

    authorForenameInput.valueChanges.subscribe(
      forename => this.filterAuthorForename(forename, index)
    );
  }
  // tslint:disable-next-line:typedef
  checkTheChangeSurname() {
    const index = this.authors.controls.length - 1;
    const authorSurnameInput = this.authors.controls[index].get('authorSurnameInput');

    authorSurnameInput.valueChanges.subscribe(
      surname => this.filterAuthorSurname(surname, index)
    );
  }
  // tslint:disable-next-line:typedef
  private checkTheChangeBookTag() {
    const index = this.bookTags.controls.length - 1;
    const booksTagInput = this.bookTags.controls[index].get('booksTagInput');

    // @ts-ignore
    booksTagInput.valueChanges.subscribe(
      bookTag => this.filterBookTags(bookTag, index)
    );
  }
  // tslint:disable-next-line:typedef
  checkTheChangeYear() {
    this.myFormModel.get('yearOfPublicationInput').valueChanges.subscribe(
    yearOfPublication => this.filterYear(yearOfPublication)
    );
  }

  toggleTitlePlaceholder() {
     this.showTitlePlaceholder = (this.myFormModel.get('titleInput').value === '');
  }
  // tslint:disable-next-line:typedef
  toggleAuthorForenamePlaceholder() {
    this.authors.controls.forEach((authorControl, index) => {
      this.showAuthorForenamePlaceholder[index] = (authorControl.get('authorForenameInput').value === '');
    });
  }
  // tslint:disable-next-line:typedef
  toggleAuthorSurnamePlaceholder() {
    this.authors.controls.forEach((authorControl, index) => {
      this.showAuthorSurnamePlaceholder[index] = authorControl.get('authorSurnameInput').value === '';
    });
  }
  // tslint:disable-next-line:typedef
  toggleBookTagPlaceholder() {
    this.bookTags.controls.forEach((bookTagControl, index) => {
      this.showBookTagPlaceholder[index] = bookTagControl.get('booksTagInput').value === '';
    });
  }
  // tslint:disable-next-line:typedef
  toggleYearPlaceholder() {
    this.showYearOfPublicationPlaceholder = this.myFormModel.get('yearOfPublicationInput').value === '';
  }
  createAuthor(): FormGroup {
    return this.fb.group({
      authorForenameInput: '',
      authorSurnameInput: ''
    });
  }
  // tslint:disable-next-line:typedef
  private filterAuthorForename(forename, index) {
    this.authorService.getAuthorsForenameWithSpecifiedCharacters(forename).subscribe(authorsIncoming => {
      this.filteredAuthorsForenameList[index] = authorsIncoming.map(authors => authors.forename);
      console.log(index);
    });
  }
  // tslint:disable-next-line:typedef
    private filterAuthorSurname(surname, index) {
      this.authorService.getAuthorsSurnameWithSpecifiedCharacters(surname).subscribe(authorsComing => {
        this.filteredAuthorsSurnameList[index] = authorsComing.map(authors => authors.surname);
        console.log(authorsComing);
        console.log(this.filteredAuthorsSurnameList);
      });
    }
    // tslint:disable-next-line:typedef
  private filterBookTags(bookTag, index) {
    this.bookService.getBooksTagsWithSpecifiedCharacters(bookTag).subscribe( booksTags => {
      this.filteredBooksTagsList[index] = booksTags.map(bookTags => bookTags.literaryGenre);
    });
  }
  // tslint:disable-next-line:typedef
  private filterYear(yearOfPublication: number) {
    // this.bookService.getBooksWithSpecifiedPublicationYear(yearOfPublication).subscribe( books => {
     // this.filteredYears = books.map(book => book.yearOfPublication);
  // });
  }
    // return this.authorslist.map(author => author.forename)
     // .filter(authorForename => authorForename.toLowerCase().includes(filterValue)
     // );
  addNextAuthor(): void {
    this.authors = this.myFormModel.get('authors') as FormArray;
    this.authors.push(this.createAuthor());
    // this.toggleTitlePlaceholder();
    this.toggleAuthorForenamePlaceholder();
    this.toggleAuthorSurnamePlaceholder();
    this.checkTheChangeForename();
    this.checkTheChangeSurname();
  }

  createBooksTag(): FormGroup {
    return this.fb.group({
      booksTagInput: ''
    });
  }

  addNextBooksTag(): void {
    this.bookTags = this.myFormModel.get('bookTags') as FormArray;
    this.bookTags.push(this.createBooksTag());
    this.toggleBookTagPlaceholder();
    this.checkTheChangeBookTag();
  }

  /*showAddBookForm(): void {
        // this.mode = 'add';
        this.showBookForm();
  }*/
  // tslint:disable-next-line:typedef
  changeBook() {
    console.log('changeBook');
    this.mode = 'edit';
    const book: Book = {
        id: this.idBook,
        title: this.myFormModel.get('titleInput').value,
        authors: [],
        bookTags: [],
        yearOfPublication: this.myFormModel.get('yearOfPublicationInput').value,
        signature: this.myFormModel.get('signatureInput').value
      };
    this.authors.controls.forEach(authorControl => {
      // @ts-ignore
      const author: Author = {
        id: null,
        forename: authorControl.get('authorForenameInput').value,
        surname: authorControl.get('authorSurnameInput').value,
      };
      book.authors.push(author);
    });
    this.bookTags.controls.forEach(booksTagControl => {
      const bookTag: BookTag = {
        id: null,
        literaryGenre: booksTagControl.get('booksTagInput').value
      };
      book.bookTags.push(bookTag);
    });
      // @ts-ignore
    this.bookService.updateBook(book).subscribe((modifiedBook) => {
      console.log(modifiedBook);
      this.isCreated = true;
      if (this.isCreated) {
        this.loadData.emit();
        this.closeDialog();
      }},

        (response: HttpErrorResponse) => {
        console.log(response.error);
        this.validationErrors = response.error;
        this.isCreated = false;
      });
    }
    showEditBookForm() {
    this.mode = 'edit';
    this.isHidden = false;
    this.checkedList = this.checkboxservice.getBooksMap();

    if (this.checkboxservice.lengthBooksMap() === 1) {
      this.idBook = Number(this.checkedList.keys().next().value);


      this.bookService.getBookById(this.idBook).subscribe((bookFromDb) => {
        this.bookToModified = bookFromDb;
        this.myFormModel.get('titleInput').setValue(bookFromDb.title);
        this.myFormModel.get('yearOfPublicationInput').setValue(bookFromDb.yearOfPublication);
        this.myFormModel.get('signatureInput').setValue(bookFromDb.signature);

        while (this.authors.length > bookFromDb.authors.length) {
          this.authors.removeAt(0);
        }

        bookFromDb.authors.forEach((author, index) => {
          if (index >= this.authors.length) {
            console.log(index);
            this.addNextAuthor();
          }

          this.authors.at(index).get('authorForenameInput').setValue(author.forename);
          this.authors.at(index).get('authorSurnameInput').setValue(author.surname);
        });
        bookFromDb.bookTags.forEach((bookTag, index) => {
          if (index) {
            this.addNextBooksTag();
          }
          this.bookTags.at(index).get('booksTagInput').setValue(bookTag.literaryGenre);
        });
      });
    }

    if (this.checkboxservice.lengthBooksMap() === 0) {
        alert('Brak zaznaczonego');
    }
    if (this.checkboxservice.lengthBooksMap() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
      console.log(alert());
      console.log(this.checkboxservice.lengthBooksMap());
    }
  }

  // tslint:disable-next-line:typedef
  saveBook() {
    if (this.mode === 'edit') {
       this.changeBook();
    } else {
      const book: Book = {
        id: null,
        title: this.myFormModel.get('titleInput').value,
        authors: [],
        bookTags: [],
        yearOfPublication: this.myFormModel.get('yearOfPublicationInput').value,
        signature: this.myFormModel.get('signatureInput').value
      };
      this.authors.controls.forEach(authorControl => {
        const author: Author = {
          id: null,
          forename: authorControl.get('authorForenameInput').value,
          surname: authorControl.get('authorSurnameInput').value,
        };
        book.authors.push(author);
      });
      this.bookTags.controls.forEach(booksTagControl => {
        const bookTag: BookTag = {
          id: null,
          literaryGenre: booksTagControl.get('booksTagInput').value
        };
        book.bookTags.push(bookTag);
      });
      this.bookService.saveBookToDB(book).subscribe(saveBook => {
        if (saveBook !== undefined) {
          this.isCreated = true;
        }
        if (this.isCreated) {
            this.loadData.emit();
            this.closeDialog();
          }
        },
        (response: HttpErrorResponse) => {
          console.log(response.error);
          this.validationErrors = response.error;
          this.isCreated = false;
        });
    }
  }

  deleteAuthors(circle: HTMLElement) {
    this.authors.removeAt(Number(circle.id));
  }

  // tslint:disable-next-line:typedef
  deleteBooksTags(i) {
    this.bookTags.removeAt(i);
  }


  // tslint:disable-next-line:typedef
  clearBookForm() {
    this.myFormModel.get('titleInput').setValue('');
    this.myFormModel.get('yearOfPublicationInput').setValue('');
    this.myFormModel.get('signatureInput').setValue('');

    this.authors.controls.forEach(authorControl => {
      authorControl.get('authorForenameInput').setValue('');
      authorControl.get('authorSurnameInput').setValue('');
    });

    this.bookTags.controls.forEach(booksTagControl => {
      booksTagControl.get('booksTagInput').setValue('');
      });
  }
  // tslint:disable-next-line:typedef

  clearValidationErrors() {
   this.validationErrors.title = null;

   console.log(this.validationErrors);
    // @ts-ignore
   // console.log(this.validationErrors['authors[0].forename']);
    //this.validationErrors.authors[0].forename = null;
    this.validationErrors['authors[0].forename'][0] = '';
    // this.validationErrors.bookTags. = '';
   this.validationErrors.yearOfPublication = null;
   this.validationErrors.signature = null;
    this.validationErrors = undefined;
  }
  // this.showYearOfPublicationPlaceholder = this.myFormModel.get('yearOfPublicationInput').value === '';

 // validationErrors['authors[' + i + '].forename'][0]


  /*this.validationErrors.authors.forEach((author, index) => {
  this.authorSurnameError[index] = author.surname[index] = null;*/

}




































