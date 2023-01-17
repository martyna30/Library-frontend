import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorsComponent} from './authors/authors.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {BooksComponent} from './books/books.component';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {UserComponent} from './add-user/user.component';
import {AuthGuard} from './auth/auth.guard';
import {UserAuthService} from '../services/user-auth.service';
import {RentalComponent} from './rental/rental.component';




const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full',  },
  {path: 'books', component: BooksComponent, canActivate: [AuthGuard] },
  {path: 'authors', component: AuthorsComponent,  canActivate: [AuthGuard]  },
  {path: 'tags', component: AuthorsComponent },
  {path: 'users', component: UserComponent  , canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {path: 'rental', component: RentalComponent, canActivate: [AuthGuard] },
  {path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],

  providers: [
    AuthGuard,
    UserAuthService
  ],
  exports: [RouterModule],
  })
export class AppRoutingModule {}
