// @ts-ignore

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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {AuthorService} from '../services/author.service';

import {AdDirective} from './directive/ad.directive';
import {CheckboxService} from '../services/checkbox.service';


@NgModule({
  declarations: [
    AppComponent,
    AddComponent,
    UpdateComponent,
    DeleteComponent,
    GetComponent,
    AdDirective,
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule, ReactiveFormsModule
  ],
  providers: [BookService, HttpService, AuthorService, CheckboxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
