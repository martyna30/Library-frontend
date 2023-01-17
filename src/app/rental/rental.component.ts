import {Component, Input, OnInit} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Observable} from 'rxjs';
import {Rental} from '../models-interface/rental';
import {CheckboxService} from '../../services/checkbox.service';

@Component({
  selector: 'app-rental',
  templateUrl: './rental.component.html',
  styleUrls: ['./rental.component.scss']
})
export class RentalComponent implements OnInit {

  @Input()
  rentalList = [];
  isHidden = true;
  private checkboxOfBook: number;

  constructor(private bookService: BookService, private checkboxService: CheckboxService) { }

  ngOnInit(): void {
   this.loadData();
  }



  showRentalTable(): void {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }

    loadData() {
      this.bookService.borrowedBooks$.subscribe(rentals => {
        this.rentalList = rentals;
      });
    }

  changeCheckboxList(checkboxOfBook: HTMLInputElement) {    // checkboxOfBook: HTMLInputElement
    // tslint:disable-next-line:align
    if (checkboxOfBook.checked) {
      this.checkboxOfBook = Number(checkboxOfBook.value);
      this.checkboxService.addToRentalsMap(Number(this.checkboxOfBook));

    } else {
      this.checkboxService.removeFromRentalsMap(Number(this.checkboxOfBook));

    }
  }

}

