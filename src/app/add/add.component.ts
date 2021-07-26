import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';
import {AuthorService} from '../../services/author.service';
import {Author} from '../models-interface/author';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {BookTag} from '../models-interface/bookTag';
import {any} from 'codelyzer/util/function';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {empty} from 'rxjs/internal/Observer';
import {filter, map} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {BookValidationError} from '../models-interface/bookValidationError';
// @ts-ignore
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {
  isHidden = true;

  myFormModel: FormGroup;
  authors: FormArray;
  booksTags: FormArray;

  validationErrors: BookValidationError;
  private isCreated = false;
  private bookExist = false;


  constructor(private fb: FormBuilder, private authorService: AuthorService, private bookService: BookService) {
  }

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
    console.log('addNextAuthor');
    this.authors = this.myFormModel.get('authors') as FormArray;
    console.log(this.authors);
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


  showAddBookForm() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

  saveBook() {
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
      data => {
        console.log(data);
        this.isCreated = true;
        this.bookExist = false;
        },
      response => {
        console.log(response.error);
        this.validationErrors = {
          title: response.error[0]
        };

        this.isCreated = false;
        if (response.status === 409) {
          this.isCreated = false;
          this.bookExist = true;
        }
      }
    );
  }
}


// this.authorService.getIdByName(authorControl.get('authorForenameInput').value, authorControl.get('authorSurnameInput').value)
// .subscribe((idAuthor: number) => {
// this.idFound = idAuthor;


  /*data => this.errorResponse = data['message'],
  (error: HttpErrorResponse) =>
    this.errorResponse = ''*/
























