import {BookTag} from './bookTag';
import {Author} from './author';

export interface Book {
  title: string;
  yearOfPublication: number;
  signature: string;
  bookTag: Array<BookTag>;
  author: Array<Author>;
}
