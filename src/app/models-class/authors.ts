import {Input} from '@angular/core';
// @ts-ignore
import {Author} from './authors';

// @ts-ignore
export class Author implements Author {
  @Input() id: number;
  @Input() surname: string;
  @Input() forename: string;


  constructor(id: number, surname: string, forename: string) {
    this.id = id;
    this.surname = surname;
    this.forename = forename;
  }


  getId(): number {
    return this.id;
  }
}
