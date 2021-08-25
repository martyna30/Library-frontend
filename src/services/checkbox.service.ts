import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Book} from '../app/models-interface/book';

@Injectable({
  providedIn: 'root'
})
export class CheckboxService {

  private map = new Map<number, number>();

  getMap(): Map<number, number> {
    return this.map;
  }

  add(id: number): void {
    this.map.set(id, 1);
  }

  remove(id: number): void {
    this.map.delete(id);
  }

  length(): number {
    return this.map.size;
  }

}

