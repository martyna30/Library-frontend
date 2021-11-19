import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
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


// @ts-ignore
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  constructor(private fb: FormBuilder, private authorService: AuthorService, private bookService: BookService, private checkboxservice: CheckboxService) {}
  isHidden = true;
  showTitlePlaceholder: boolean;
  showAuthorForenamePlaceholder = [];
  showAuthorSurnamePlaceholder = [];

  filteredTitles: string[] = [];
  filteredAuthorsForenameList = [];
  filteredAuthorsSurnameList = [];


  myFormModel: FormGroup;
  authors: FormArray;
  booksTags: FormArray;

  validationErrors: BookValidationError;
  private isCreated = false;
  private bookExist = false;
  private mode: string;
  private checkedList: Map<number, number>;
  private idBook: number;
  private bookToModified: Book;



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
    /*this.authors.controls.forEach((authorControl, index) => {
      this.authors.at(index).get('authorForenameInput').valueChanges.subscribe(forename => {
        this.filterAuthorForename(forename, index);
        console.log(forename, index);
      });
   }),*/
    this.authors.controls.forEach((authorControl2, index) => {
      authorControl2.get('authorSurnameInput').valueChanges.subscribe(surname => {
          this.filterAuthorSurname(surname);
          console.log(surname);
        });
      }),
      this.myFormModel.get('titleInput').valueChanges.subscribe(response => {
      console.log('data is', response);
      setTimeout(() => 3000);
      this.filterBookTitles(response);
    });
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
  displayFn(subject) {
    return subject ? subject.name : undefined;
  }
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
    private filterAuthorSurname(surname) {
      this.authorService.getAuthorsSurnameWithSpecifiedCharacters(surname).subscribe(authorsComing => {
        this.filteredAuthorsSurnameList = authorsComing.map(author => author.surname);
        console.log(authorsComing);
        console.log(this.filteredAuthorsSurnameList);
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

  }

  createBooksTag(): FormGroup {
    return this.fb.group({
      booksTagInput: ''
    });
  }

  addNextBooksTag(): void {
    this.booksTags = this.myFormModel.get('booksTags') as FormArray;
    this.booksTags.push(this.createBooksTag());
  }

  // tslint:disable-next-line:typedef
  private showBookForm() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }

  }



  showAddBookForm(): void {
    this.mode = 'add';
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
      this.bookService.updateBook(book).subscribe((modifiedBook) => {
      console.log(modifiedBook);
      this.isCreated = true;
      },
        response => {
      console.log(response.error);
      this.validationErrors = response.error;
      this.isCreated = false;
      });
    });
  }

  showEditBookForm(): void {
    this.mode = 'edit';
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

      if (this.checkboxservice.lengthBooksMap() === 0) {
        alert('Brak zaznaczonego');
      }
      if (this.checkboxservice.lengthBooksMap() > 1) {
        alert('jest zaznaczony więcj niż jeden, może byc jeden');
      }
    }
  }


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
            this.bookService.addBookToList(book);
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




































