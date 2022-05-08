import {Component, OnInit} from '@angular/core';
import {HttpService} from '../services/http.service';
import {BookService} from '../services/book.service';
import {Book} from './models-interface/book';
import {CheckboxService} from '../services/checkbox.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'library-frontend';
  errorMessage: string;

  ngOnInit(): void {
  }


}










