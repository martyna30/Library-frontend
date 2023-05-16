import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {BookTagsService} from '../../services/book-tags.service';
import {BookTag} from '../models-interface/bookTag';

@Component({
  selector: 'app-book-tags',
  templateUrl: './book-tags.component.html',
  styleUrls: ['./book-tags.component.scss']
})
export class BookTagsComponent implements OnInit {
  tags: Observable<BookTag[]>;
  constructor(private bookTagsService: BookTagsService) { }

  ngOnInit(): void {
    this.tags = this.bookTagsService.getBooksTags();

  }

}
