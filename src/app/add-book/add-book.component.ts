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
import {Observable} from 'rxjs';


// @ts-ignore
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  constructor(private fb: FormBuilder, private authorService: AuthorService, private bookService: BookService, private checkboxservice: CheckboxService) {}
  isHidden = true;

  filteredTitles: string[] = [];

  @Input()
  bookslist: Array<Book>;


  authorslist: Array<Author>;

  filteredAuthorsForenameList: Observable<string[]>;


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
    console.log('aaa');
    this.addNextAuthor();
    this.addNextBooksTag();
    this.bookService.getBooksFromBookService().subscribe(books => {
     this.bookslist = books;
     });
    /*this.authorService.getAuthorsFromAuthorsService().subscribe(authors => {
      this.authorslist = authors;
    });
    // @ts-ignore
    /*this.filteredAuthorsForenameList = this.authors.controls.map(authorControl => {
      authorControl.get('authorForenameInput').valueChanges.pipe(
        startWith(''),
        map(value => this.filterAuthorForename(value))
      );*/
   // });
    // @ts-ignore
    this.myFormModel.get('titleInput').valueChanges.subscribe(response => {
      console.log('data is', response);
      this.filterBookTitles(response);
    });
    /*pipe(
      debounceTime(1000),
      startWith(''),
      map(value => this.filterBookTitles(value))
      );*/
  }
  // @ts-ignore
  // tslint:disable-next-line:typedef
  private filterBookTitles(enteredTitle) {
    // tslint:disable-next-line:only-arrow-functions
    // @TODO coś nie tak jest z tym this.bookslist - to nigdzie nie jest tworzone, więc po czym ten map jest?

    this.filteredTitles = this.bookslist.map(books => books.title)
      .filter(title => {
        return title.toLowerCase().indexOf(enteredTitle.toLowerCase()) > -1;
      });

    console.log(this.filteredTitles);
  }
  // tslint:disable-next-line:typedef
  displayFn(subject) {
    return subject ? subject.name : undefined;
  }
  createAuthor(): FormGroup {
    return this.fb.group({
      authorForenameInput: '',
      authorSurnameInput: ''
    });
  }
  // tslint:disable-next-line:typedef
  private filterAuthorForename(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.authorslist.map(author => author.forename)
     .filter(authorForename => authorForename.toLowerCase().includes(filterValue)
     );
  }
  addNextAuthor(): void {
    this.authors = this.myFormModel.get('authors') as FormArray;
    this.authors.push(this.createAuthor());
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
  // tslint:disable-next-line:typedef
  getAuthorsListFromService() {
    this.authorService.getAuthorsFromAuthorsService().subscribe(authors => {
      this.authorslist = authors;
    });
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
  // tslint:disable-next-line:typedef
}




































