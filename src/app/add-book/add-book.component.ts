import {Component, EventEmitter, Inject, Input, OnInit} from '@angular/core';
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



// @ts-ignore
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  @Input()
  page;
  @Input()
  size;

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


  myFormModel: FormGroup;
  authors: FormArray;
  booksTags: FormArray;

  validationErrors: BookValidationError;
  private isCreated = false;
  private bookExist = false;
   mode: string;
  private checkedList: Map<number, number>;
  private idBook: number;
  private bookToModified: Book;
  constructor(private fb: FormBuilder, private authorService: AuthorService, private bookService: BookService, private checkboxservice: CheckboxService) {// @Inject(MAT_DIALOG_DATA) data: {mode}) {   // private dialogRef: MatDialogRef<AddBookComponent>
  }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
      titleInput: '',
      authors: this.fb.array([]),
      booksTags: this.fb.array([]),
      yearOfPublicationInput: '',
      signatureInput: ''
    });
    this.addNextAuthor();
    this.addNextBooksTag();
    this.checkTheChangeTitle();
    this.checkTheChangeYear();

  }

  showBookForm(): void {
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
    const index = this.booksTags.controls.length - 1;
    const bookTagInput = this.booksTags.controls[index].get('booksTagInput');

    // @ts-ignore
    bookTagInput.valueChanges.subscribe(
      bookTag => this.filterBookTags(bookTag, index)
    );
  }
  // tslint:disable-next-line:typedef
  checkTheChangeYear() {
    this.myFormModel.get('yearOfPublicationInput').valueChanges.subscribe(
    yearOfPublication => this.filterYear(yearOfPublication)
    );
  }
  /*displayFn(subject) {
    return subject ? subject.name : undefined;
  }*/
  // tslint:disable-next-line:typedef
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
    this.booksTags.controls.forEach((bookTagControl, index) => {
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
    this.bookService.getBooksWithSpecifiedPublicationYear(yearOfPublication).subscribe( books => {
      this.filteredYears = books.map(book => book.yearOfPublication);
  });
  }
    // return this.authorslist.map(author => author.forename)
     // .filter(authorForename => authorForename.toLowerCase().includes(filterValue)
     // );
  addNextAuthor(): void {
    this.authors = this.myFormModel.get('authors') as FormArray;
    this.authors.push(this.createAuthor());
    this.toggleTitlePlaceholder();
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
    this.booksTags = this.myFormModel.get('booksTags') as FormArray;
    this.booksTags.push(this.createBooksTag());
    this.toggleBookTagPlaceholder();
    this.checkTheChangeBookTag();
  }

  showAddBookForm(): void {
        // this.mode = 'add';
        this.showBookForm();
  }
  // tslint:disable-next-line:typedef
  changeBook() {
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
    this.booksTags.controls.forEach(booksTagControl => {
      const bookTag: BookTag = {
        id: null,
        literaryGenre: booksTagControl.get('booksTagInput').value
      };
      book.bookTags.push(bookTag);
      // @ts-ignore
      this.bookService.updateBook(book).subscribe((modifiedBook) => {
      console.log(modifiedBook);
      this.isCreated = true;
      if (this.isCreated === true) {
        this.bookService.getBookListObservable(this.page, this.size);
      }},
        response => {
      console.log(response.error);
      this.validationErrors = response.error;
      this.isCreated = false;
      });
    });
  }


  // tslint:disable-next-line:typedef
  showEditBookForm() {
    // this.mode = 'edit';
   this.showBookForm();
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
          this.booksTags.at(index).get('booksTagInput').setValue(bookTag.literaryGenre);
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
      this.booksTags.controls.forEach(booksTagControl => {
        const bookTag: BookTag = {
          id: null,
          literaryGenre: booksTagControl.get('booksTagInput').value
        };
        book.bookTags.push(bookTag);
      });
      this.bookService.saveBookToDB(book).subscribe(
        createdBook => {
            console.log(createdBook);
            this.isCreated = true;
            this.bookExist = false;
            if (this.isCreated) {
            this.bookService.getBookListObservable(this.page, this.size).subscribe(

            );
            this.clearBookForm();
            this.clearValidationErrors();

            }},
        response => {
          console.log(response.error);
          this.validationErrors = response.error;
          this.isCreated = false;
          if (response.status === 400) {
            this.isCreated = false;
            this.bookExist = true;
          }
          console.log(response);
        });
    }
  }

  // tslint:disable-next-line:typedef
  deleteAuthors(circle: HTMLElement) {
    this.authors.removeAt(Number(circle.id));
  }
  // tslint:disable-next-line:typedef
  deleteBooksTags(circle: HTMLElement) {
    this.booksTags.removeAt(Number(circle.id));
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

    this.booksTags.controls.forEach(booksTagControl => {
      booksTagControl.get('booksTagInput').setValue('');
      });
  }
  // tslint:disable-next-line:typedef

  clearValidationErrors() {
    this.validationErrors.title = '';
    // @ts-ignore
    this.validationErrors.authors = '';
    // @ts-ignore
    this.validationErrors.bookTags = '';
    this.validationErrors.yearOfPublication = '';
    this.validationErrors.signature = '';
  }


}




































