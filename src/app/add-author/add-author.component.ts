import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {AuthorValidationError} from '../models-interface/authorValidationError';
import {CheckboxService} from '../../services/checkbox.service';
import {Author} from '../models-interface/author';
import {AuthorService} from '../../services/author.service';
import {HttpErrorResponse} from '@angular/common/http';



@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.scss']
})
export class AddAuthorComponent implements OnInit {
  @Input()
  page;
  @Input()
  size;

  @Output()
  loadData: EventEmitter<any> = new EventEmitter();

  isHidden = true;
  isButtonHidden: boolean;

  showAuthorForenamePlaceholder: boolean;
  showAuthorSurnamePlaceholder: boolean;
  filteredAuthorsForenameList: string[];
  filteredAuthorsSurnameList: string[];

  myFormModel: FormGroup;
  // authors: FormArray;


  validationErrors: AuthorValidationError;
  mode: string;
  private isCreated = false;
  private authorExist = false;
  private checkedList: Map<number, number>;
  private idAuthor: number;

  constructor(private fb: FormBuilder, private authorService: AuthorService, private checkboxservice: CheckboxService) {
  }

  ngOnInit(): void {
    this.myFormModel = this.fb.group({
     // authors: this.fb.array([])
      authorForenameInput: '',
      authorSurnameInput: ''
    });
    this.checkTheChangeAuthorForename();
    this.checkTheChangeAuthorSurname();
  }
  // tslint:disable-next-line:typedef
  private showAuthorForm() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;
    }
  }
  // tslint:disable-next-line:typedef
  showAddAuthorForm() {
    this.mode = 'add';
    this.showAuthorForm();
    this.isButtonHidden = false;
  }
  // tslint:disable-next-line:typedef
  showEditAuthorForm() {
    this.mode = 'edit';
    this.showAuthorForm();
    this.isButtonHidden = true;
    this.checkedList = this.checkboxservice.getAuthorsMap();

    if (this.checkboxservice.lengthAuthorsMap() === 1) {
      this.idAuthor = Number(this.checkedList.keys().next().value);

      this.authorService.getAuthorById(this.idAuthor).subscribe((authorFromDb) => {
        this.myFormModel.get('authorForenameInput').setValue(authorFromDb.forename);
        this.myFormModel.get('authorSurnameInput').setValue(authorFromDb.surname);
      });
    }
    if (this.checkboxservice.lengthBooksMap() === 0) {
      alert('Brak zaznaczonego');
    }
    if (this.checkboxservice.lengthBooksMap() > 1) {
      alert('jest zaznaczony więcj niż jeden, może byc jeden');
    }
  }


  // tslint:disable-next-line:typedef
  /*deleteAuthors(circle: HTMLElement) {
    this.authors.removeAt(Number(circle.id));
  }*/

  // tslint:disable-next-line:typedef
  private changeAuthor() {
    const author: Author = {
        id: this.idAuthor,
        forename: this.myFormModel.get('authorForenameInput').value,
        surname: this.myFormModel.get('authorSurnameInput').value,
      };
    this.authorService.updateAuthor(author).subscribe((modifiedAuthor) => {
          console.log(modifiedAuthor);
          this.isCreated = true;
          if (this.isCreated) {
            this.loadData.emit();
            this.closeDialog();
          }
        },
      (response: HttpErrorResponse) => {
          console.log(response.error);
          this.validationErrors = response.error;
          this.isCreated = false;
        });
    }
  // tslint:disable-next-line:typedef
  saveAuthor() {
    // @ts-ignore
    if (this.mode === 'edit') {
      this.changeAuthor();
    } else {
      const author: Author = {
          id: null,
          forename: this.myFormModel.get('authorForenameInput').value,
          surname: this.myFormModel.get('authorSurnameInput').value
        };
      this.authorService.saveAuthor(author).subscribe(
          createdAuthor => {
            console.log(createdAuthor);
            this.isCreated = true;
            this.authorExist = false;
            if (this.isCreated) {
              this.loadData.emit();
              this.closeDialog();
            }
          },
        (response: HttpErrorResponse) => {
            console.log(response.error);
            this.validationErrors = response.error;
            this.isCreated = false;
            console.log(response);
          });
      }
    }

    clearAuthorForm() {
      this.myFormModel.get('authorForenameInput').setValue('');
      this.myFormModel.get('authorSurnameInput').setValue('');
  }

  clearValidationErrors() {
    this.validationErrors.forename = '';
    // @ts-ignore
    this.validationErrors.surname = '';
  }
  checkTheChangeAuthorForename() {
    this.myFormModel.get('authorForenameInput').valueChanges.subscribe(
      forename => this.filterForename(forename)
    );
  }
  // tslint:disable-next-line:typedef
  filterForename(forename: string) {
    this.authorService.getAuthorsForenameWithSpecifiedCharacters(forename).subscribe( authorsIncoming =>
      this.filteredAuthorsForenameList = authorsIncoming.map(authors => authors.forename)
    );
  }
  // tslint:disable-next-line:typedef
  checkTheChangeAuthorSurname() {
    this.myFormModel.get('authorSurnameInput').valueChanges.subscribe(
      surname => this.filterSurname(surname)
    );
  }
  // tslint:disable-next-line:typedef
  filterSurname(surname: string) {
    this.authorService.getAuthorsSurnameWithSpecifiedCharacters(surname).subscribe(authorsComing => {
      this.filteredAuthorsSurnameList = authorsComing.map(authors => authors.surname);
    });
  }
  // tslint:disable-next-line:typedef
  toggleAuthorForenamePlaceholder() {
    this.showAuthorForenamePlaceholder = this.myFormModel.get('authorForenameInput').value === '';
  }
  // tslint:disable-next-line:typedef
  toggleAuthorSurnamePlaceholder() {
    this.showAuthorSurnamePlaceholder = this.myFormModel.get('authorSurnameInput').value === '';
  }

  closeDialog(): void {
    this.isHidden = true;
    this.clearAuthorForm();
    this.clearValidationErrors();
  }


}
