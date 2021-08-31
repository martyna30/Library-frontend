import { Component, OnInit } from '@angular/core';
import {CheckboxService} from '../../services/checkbox.service';
import {BookService} from '../../services/book.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  isHidden = true;
  private checkedList: Map<number, number>;
  private idBook: number;

  constructor(private checkboxService: CheckboxService, private bookService: BookService) {
  }

  ngOnInit(): void {
  }

  /*DeleteABook() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }*/

  // tslint:disable-next-line:typedef
  confirmMethod(id: number) {
    if (confirm('Are you sure to delete book ' + id)) {
      console.log('Implement delete functionality here');
    }
  }

  // tslint:disable-next-line:typedef
  deleteBook() {
    // @ts-ignore
    if (this.checkboxService.length() === 1) {
      this.checkedList = this.checkboxService.getMap();
      const bookId = Number(this.checkedList.keys().next().value);

      if (confirm('Are you sure to delete book ')) {
        this.bookService.deleteBook(bookId);
      }
    }
    if (this.checkboxService.length() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
    }
    // @ts-ignore
    if (this.checkboxService.length() === 0) {
      alert('Brak zaznaczonego');
    }

  }
}


