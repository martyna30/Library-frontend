import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import {BookService} from '../services/book.service';
import {HttpService} from '../services/http.service';
import { GetComponent } from './get/get.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

import { BookAuthorListComponent } from './book-author-list/book-author-list.component';
import {AuthorService} from '../services/author.service';
import { BookAuthorListContentComponent } from './book-author-list-content/book-author-list-content.component';
import {AdDirective} from './directive/ad.directive';


@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    UpdateComponent,
    DeleteComponent,
    GetComponent,
    BookAuthorListComponent,
    BookAuthorListContentComponent,
    AdDirective
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule
  ],
  providers: [BookService, HttpService, AuthorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
