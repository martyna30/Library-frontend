import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {BookService} from '../../services/book.service';
import {AuthorService} from '../../services/author.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  @Input()
  page;
  @Input()
  size;

  @Output()
  loadData: EventEmitter<any> = new EventEmitter();

  private isDeleted = false;
  private error: string;
  isHidden = true;
  private checkedList: Map<number, number>;
  private idBook: number;

  constructor(private checkboxService: CheckboxService, private bookService: BookService, private authorService: AuthorService) {
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  deleteBook() {
    // @ts-ignore
    if (this.checkboxService.lengthBooksMap() === 1) {
      this.checkedList = this.checkboxService.getBooksMap();
      const bookId = Number(this.checkedList.keys().next().value);

      if (confirm('Are you sure to delete book ')) {
        this.bookService.deleteBook(bookId).subscribe(
          (deletedBook) => {
            console.log('the book nr' + deletedBook + 'had been deleted');
            this.isDeleted = true;
            if (this.isDeleted) {
              this.loadData.emit();
            }
          },
          (response: HttpErrorResponse) => {
            console.log(response.error);
            this.error = response.error;
            this.isDeleted = false;
            console.log(response);
          }
        );
      }
      if (this.checkboxService.lengthBooksMap() > 1) {
        alert('jest zaznaczony więcj niż jeden, może byc jeden');
      }
      // @ts-ignore
      if (this.checkboxService.lengthBooksMap() === 0) {
        alert('Brak zaznaczonego');
      }

    }

    /*deleteAuthor() {
      // @ts-ignore
      if (this.checkboxService.lengthAuthorsMap() === 1) {
        this.checkedList = this.checkboxService.getAuthorsMap();
        const authorId = Number(this.checkedList.keys().next().value);

        if (confirm('Are you sure to delete book ')) {
          this.authorService.deleteAuthor(authorId);
          this.bookService.getBookListObservable(this.page, this.size);
        }
      }
      if (this.checkboxService.lengthBooksMap() > 1) {
        alert('jest zaznaczony więcj niż jeden, może byc jeden');
      }
      // @ts-ignore
      if (this.checkboxService.lengthBooksMap() === 0) {
        alert('Brak zaznaczonego');
      }

    }*/
  }
}


