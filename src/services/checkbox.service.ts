import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../app/models-interface/book';

@Injectable({
  providedIn: 'root'
})
export class CheckboxService {

  private booksMap = new Map<number, number>();
  private authorsMap = new Map<number, number>();

  getBooksMap(): Map<number, number> {
    return this.booksMap;
  }

  addToBooksMap(id: number): void {
    this.booksMap.set(id, 1);
  }

  removeFromBooksMap(id: number): void {
    this.booksMap.delete(id);
  }

  lengthBooksMap(): number {
    return this.booksMap.size;
  }

  getAuthorsMap(): Map<number, number> {
    return this.authorsMap;
  }

  addToAuthorsMap(id: number): void {
    this.authorsMap.set(id, 1);
  }

  removeFromAuthorsMap(id: number): void {
    this.authorsMap.delete(id);
  }

  lengthAuthorsMap(): number {
    return this.authorsMap.size;
  }


}

