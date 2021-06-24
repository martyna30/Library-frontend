import {BookTag} from './bookTag';
import {Author} from './author';

export interface Book {
  id: number;
  title: string;
  yearOfPublication: number;
  signature: string;
  bookTags: Array<BookTag>;
  authors: Array<Author>;
}
