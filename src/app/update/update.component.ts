import { Component, OnInit } from '@angular/core';
import {Book} from '../models-interface/book';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  isHidden: boolean;

  constructor() {
    this.isHidden = true;
  }

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  ChangeABook() {
    if (this.isHidden) {
      this.isHidden = !this.isHidden;
    } else {
      this.isHidden = true;


    }
  }
}








