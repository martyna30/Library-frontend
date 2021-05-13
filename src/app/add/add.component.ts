import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {Book} from '../models-interface/book';
import {BookService} from '../../services/book.service';

import {BookTag} from '../models-interface/bookTag';
import {AuthorService} from '../../services/author.service';

import {BookAuthorListComponent} from '../book-author-list/book-author-list.component';
import {BookAuthorListContentComponent} from '../book-author-list-content/book-author-list-content.component';
import {Observable} from 'rxjs';
import {Author} from '../models-interface/author';




@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  bookAuthorsComponent: BookAuthorListContentComponent[];

  authorFound: Author;
  isHidden = true;
  bookslist: Array<Book> = [];
  authorForenameInput: string;
  authorSurnameInput: string;
  booksTagInput: [] ; // Array<BookTag>;
  yearOfPublicationInput: number;
  signatureInput: string;
  titleInput = '';

  ngOnInit(): void {
  }

  constructor(private bookService: BookService, private authorService: AuthorService) {
    this.bookService.getBookListObservable().subscribe((books: Array<Book>) => {
      this.bookslist = books;
    });
    // @ts-ignore
    return this.authorService.findAuthorWithName().subscribe((authorInput) => {
      this.authorFound = authorInput;
    });
  }
  // tslint:disable-next-line:typedef
  saveBook() {
    const book: Book = {
      title: this.titleInput,
      yearOfPublication: this.yearOfPublicationInput,
      signature: this.signatureInput,
      author: [],
      bookTag: [{literaryGenre: 'c'}]
    };

    this.bookAuthorsComponent.forEach(bookAuthor => {
      const authorFound = this.authorFound;
      // @ts-ignore
      const author = new Author (
        authorFound !== undefined ? authorFound.id : null,
        this.authorSurnameInput,
        this.authorForenameInput
      );
      book.author.push(author);
      });

    this.bookService.addBook(book);
    this.bookService.saveBookToDB(book);
    this.titleInput = '';
    this.authorSurnameInput = '';
    this.authorForenameInput = '';
    this.booksTagInput = null;
    this.yearOfPublicationInput = null;
    this.signatureInput = '';
  }
  // tslint:disable-next-line:typedef

  // tslint:disable-next-line:typedef
  showAddBookForm() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }



}
