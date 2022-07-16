import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsComponent} from './authors/authors.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {BooksComponent} from './books/books.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {UserComponent} from './add-user/user.component';



const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full' },
  {path: 'books', component: BooksComponent },
  {path: 'authors', component: AuthorsComponent },
  {path: 'users', component: UserComponent },
  {path: 'login', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  })
export class AppRoutingModule {}
