// @ts-ignore

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import {BookService} from '../services/book.service';
import {HttpService} from '../services/http.service';
import {AuthorsComponent } from './authors/authors.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AuthorService} from '../services/author.service';
import {AdDirective} from './directive/ad.directive';
import {AppRoutingModule} from './app-routing.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import { BooksComponent } from './books/books.component';
import { AddAuthorComponent } from './add-author/add-author.component';

import {AddBookComponent} from './add-book/add-book.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CheckboxService} from '../services/checkbox.service';


@NgModule({
  declarations: [
    AppComponent,
    AddBookComponent,
    UpdateComponent,
    DeleteComponent,
    AuthorsComponent,
    AdDirective,
    PageNotFoundComponent,
    BooksComponent,
    AddAuthorComponent,

  ],
  imports: [
   BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule, BrowserAnimationsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule
  ],
  providers: [BookService, HttpService, AuthorService, CheckboxService], // jak jest injectable root to nie musi byc tu
  bootstrap: [AppComponent]
})
export class AppModule { }
