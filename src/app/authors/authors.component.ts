import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

import {Author} from '../models-interface/author';

import {AuthorService} from '../../services/author.service';
import {CheckboxService} from '../../services/checkbox.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.css']
})
export class AuthorsComponent implements OnInit {

  // @ViewChild('add-author')
  // addAuthorComponent; // wstrzykniecie komponentu

  // authorslist: Array<Author> = [];
  authorslist: Array<Author>;
  constructor(private authorService: AuthorService, private checkboxService: CheckboxService) {}
  // authors: Observable<Author[]>;
  // @ts-ignore

  // tslint:disable-next-line:typedef
  getColor(): string {
    return 'blue';
  }

  ngOnInit(): void {
    this.authorService.getAuthorsFromAuthorsService().subscribe(authors => {
      this.authorslist = authors; });
    // this.addAuthorComponent.ngOnInit();
    // this.authorService.getAuthorsFromAuthorsService();
  }

  // tslint:disable-next-line:typedef
   changeCheckboxList(checkboxOfAuthor: HTMLInputElement) {
    if (checkboxOfAuthor.checked) {
      this.checkboxService.addToAuthorsMap(Number(checkboxOfAuthor.value));
    }
    else {
     this.checkboxService.removeFromAuthorsMap(Number(checkboxOfAuthor.value));
    }
  }
}

