import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {AuthorService} from '../../services/author.service';
import {Author} from '../models-interface/author';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BookTag} from '../models-interface/bookTag';
import {BookValidationError} from '../models-interface/bookValidationError';
import {AuthorValidationError} from '../models-interface/authorValidationError';
import {CheckboxService} from '../../services/checkbox.service';
// @ts-ignore
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {


  constructor(private fb: FormBuilder, private authorService: AuthorService, private bookService: BookService, private checkboxservice: CheckboxService) {
  }
  isHidden = true;

  myFormModel: FormGroup;
  authors: FormArray;
  booksTags: FormArray;

  validationErrors: BookValidationError;
  private isCreated = false;
  private bookExist = false;
  private mode: string;

  private checkedList: Map<number, number>;
  private idBook: number;


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
  }

  createAuthor(): FormGroup {
    return this.fb.group({
      authorForenameInput: '',
      authorSurnameInput: ''
    });
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


  showAddBookForm(): void {
    this.mode = 'add';
    this.showBookForm();
  }

  // tslint:disable-next-line:typedef
  updateBook() {
    this.bookService.updateBook(this.idBook).subscribe((modifiedBook) => {
      console.log(modifiedBook);
      this.isCreated = true;
    }, response => {
      console.log(response.error);
      this.validationErrors = response.error;
      this.isCreated = false;
    });
  }

  showEditBookForm(): void {
    this.mode = 'edit';
    this.showBookForm();
    this.checkedList = this.checkboxservice.getMap();

    if (this.checkboxservice.length() === 1) {
      this.idBook = Number(this.checkedList.keys().next().value);

      this.bookService.getBookById(this.idBook).subscribe((bookFromDb) => {
        this.myFormModel.get('titleInput').setValue(bookFromDb.title);
        this.myFormModel.get('yearOfPublicationInput').setValue(bookFromDb.yearOfPublication);
        this.myFormModel.get('signatureInput').setValue(bookFromDb.signature);

        bookFromDb.authors.forEach((author, index) => {
          if (index >= this.authors.length) {
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

      if (this.checkboxservice.length() === 0) {
        alert('Brak zaznaczonego');
      }
      if (this.checkboxservice.length() > 1) {
        alert('jest zaznaczony więcj niż jeden, może byc jeden');
      }
    }
  }


  saveBook() {
    if (this.mode === 'edit') {
      this.updateBook();
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

      this.bookService.addBook(book);
      this.bookService.saveBookToDB(book).subscribe(
        createdBook => {
          console.log(createdBook);
          this.isCreated = true;
          this.bookExist = false;
        },
        response => {
          console.log(response.error);
          this.validationErrors = response.error;
          this.isCreated = false;
          if (response.status === 409) {
            this.isCreated = false;
            this.bookExist = true;
          }
          console.log(response);
        }
      );
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


}
































