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
import {AuthGuard} from './auth/auth.guard';
import {AuthTokenInterceptor} from './interceptors/auth-token-interceptor';

// import { StoreModule } from '@ngrx/store';
// import { counterReducer } from './counter.reducer';
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {MatTableModule} from '@angular/material/table';
import {Ng2SearchPipe, Ng2SearchPipeModule} from 'ng2-search-filter';
import { CheckOutBookComponent } from './check-out-book/check-out-book.component';



// tslint:disable-next-line:typedef
export function jwtOptionsFactory(userAuthService: UserAuthService) {
  return {
    tokenGetter: () => {
      return userAuthService.getTokenFromService();
    },
    allowedDomains: ['localhost:8080'],
    disallowedRoutes: ['http://localhost:8080/v1/library/login', 'http://localhost:8080/v1/library/token/refresh']
  };
}
  /*JwtModule.forRoot({
    jwtOptionsProvider: {
    provide: JWT_OPTIONS,
      useFactory: jwtOptionsFactory,
      deps: [HttpService]
      })
 */


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
    UserComponent,
    CheckOutBookComponent,

  ],
   entryComponents: [
    AddBookComponent
   ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule,
    AppRoutingModule, BrowserAnimationsModule, MatAutocompleteModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule, MatDialogModule,
    MatButtonModule, NgbModule, MatIconModule, MatToolbarModule,
    CommonModule, Ng2SearchPipeModule,
    JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [UserAuthService]
        }
      })
  ], // StoreModule.forRoot({ count: counterReducer })],
  providers: [
    {provide: MatDialogRef, useValue: {}},
    {provide: MAT_DIALOG_DATA, useValue: {} },
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthTokenInterceptor,
    multi: true
    },
   BookService, HttpService, AuthorService, CheckboxService, AuthGuard, UserAuthService], // jak jest injectable root to nie musi byc tu
  bootstrap: [AppComponent]
})
export class AppModule { }

