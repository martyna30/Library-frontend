// @ts-ignore
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { UpdateComponent } from './update/update.component';
import { DeleteComponent } from './delete/delete.component';
import {BookService} from '../services/book.service';
import {HttpService} from '../services/http.service';
import {AuthorsComponent } from './authors/authors.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
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
import {MatTooltipModule} from '@angular/material/tooltip';
import {MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
// @ts-ignore

import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import { LoginComponent } from './login/login.component';

import {UserAuthService} from '../services/user-auth.service';
import {UserComponent} from './add-user/user.component';



@NgModule({
  declarations: [
    AppComponent,
    UpdateComponent,
    DeleteComponent,
    AuthorsComponent,
    AdDirective,
    PageNotFoundComponent,
    BooksComponent,
    AddAuthorComponent,
    AddBookComponent,
    LoginComponent,
    UserComponent
  ],
   entryComponents: [
    AddBookComponent
   ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule,
    AppRoutingModule, BrowserAnimationsModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatDialogModule,
    MatButtonModule, NgbModule, MatIconModule, MatToolbarModule,
    CommonModule
  ],
  providers: [
    {provide: MatDialogRef, useValue: {}},
    { provide: MAT_DIALOG_DATA, useValue: {} },

    BookService, HttpService, AuthorService, CheckboxService, UserAuthService], // jak jest injectable root to nie musi byc tu
  bootstrap: [AppComponent]
})
export class AppModule { }

