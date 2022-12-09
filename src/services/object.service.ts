import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpService} from './http.service';
import {ObjectName} from '../app/models-interface/ObjectName';

@Injectable({
  providedIn: 'root'
})
export class ObjectService {

  constructor(private httpService: HttpService) { }


  getObjectsWithSpecifiedTitleOrAuthor(objectToSearch): Observable<Array<ObjectName>> {
    return this.httpService.getObjectsWithSpecifiedTitleOrAuthor(objectToSearch);
  }
}
